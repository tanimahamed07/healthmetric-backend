import { Response } from "express";
import { AuthRequest } from "../types";
import sql, { createNotification } from "../config/db";

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "PATIENT") {
      // Get patient's appointments
      const [patient] = await sql`
        SELECT id FROM patients WHERE user_id = ${userId}
      `;

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const appointments = await sql`
        SELECT 
          a.*,
          d.id as doctor_id,
          d.specialization,
          d.experience,
          u.name as doctor_name,
          u.image as doctor_image
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE a.patient_id = ${patient.id}
        ORDER BY a.date DESC, a.time_slot DESC
      `;

      res.json(appointments);
    } else if (role === "DOCTOR") {
      // Get doctor's appointments
      const [doctor] = await sql`
        SELECT id FROM doctors WHERE user_id = ${userId}
      `;

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const appointments = await sql`
        SELECT 
          a.*,
          p.id as patient_id,
          p.blood_group,
          p.age,
          p.gender,
          u.name as patient_name,
          u.image as patient_image
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.doctor_id = ${doctor.id}
        ORDER BY a.date DESC, a.time_slot DESC
      `;

      res.json(appointments);
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { doctorId, date, timeSlot, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get patient record
    const [patient] = await sql`
      SELECT id FROM patients WHERE user_id = ${userId}
    `;

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get doctor info for notification
    const [doctor] = await sql`
      SELECT user_id FROM doctors WHERE id = ${doctorId}
    `;

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create appointment with PENDING status
    const [appointment] = await sql`
      INSERT INTO appointments (patient_id, doctor_id, date, time_slot, status, notes)
      VALUES (${patient.id}, ${doctorId}, ${date}, ${timeSlot}, 'PENDING', ${
        notes || null
      })
      RETURNING *
    `;

    // Notify doctor
    await createNotification(
      doctor.user_id,
      "New Appointment Request",
      `You have a new appointment request for ${date} at ${timeSlot}`,
    );

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const appointmentId = req.params.id;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !status ||
      !["PENDING", "APPROVED", "COMPLETED", "CANCELLED"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get appointment with patient and doctor info
    const [appointment] = await sql`
      SELECT 
        a.*,
        p.user_id as patient_user_id,
        d.user_id as doctor_user_id
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ${appointmentId}
    `;

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment status
    const [updated] = await sql`
      UPDATE appointments 
      SET status = ${status}
      WHERE id = ${appointmentId}
      RETURNING *
    `;

    // Notify the other party
    const isDoctor = appointment.doctor_user_id === userId;
    const notifyUserId = isDoctor
      ? appointment.patient_user_id
      : appointment.doctor_user_id;
    const notifyMessage = isDoctor
      ? `Your appointment for ${appointment.date} has been ${status.toLowerCase()}`
      : `Appointment status updated to ${status.toLowerCase()}`;

    await createNotification(notifyUserId, "Appointment Update", notifyMessage);

    res.json(updated);
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

export const getAvailableSlots = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Missing doctorId or date" });
    }

    // Get doctor availability
    const [doctor] = await sql`
      SELECT availability FROM doctors WHERE id = ${doctorId as string}
    `;

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get day of week from date
    const dayOfWeek = new Date(date as string).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const availability = doctor.availability?.[dayOfWeek];

    if (!availability || !availability.available) {
      return res.json([]); // No slots available on this day
    }

    // Generate 30-minute slots between start and end time
    const slots: string[] = [];
    const [startHour, startMin] = availability.start.split(":").map(Number);
    const [endHour, endMin] = availability.end.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeSlot = `${String(currentHour).padStart(2, "0")}:${String(
        currentMin,
      ).padStart(2, "0")}`;
      slots.push(timeSlot);

      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }

    // Get already booked slots for this date
    const bookedAppointments = await sql`
      SELECT time_slot FROM appointments
      WHERE doctor_id = ${doctorId as string} 
      AND date = ${date as string}
      AND status IN ('PENDING', 'APPROVED')
    `;

    const bookedSlots = bookedAppointments.map((a) => a.time_slot);

    // Return available slots (not booked)
    const availableSlots = slots.filter((slot) => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    console.error("Get available slots error:", error);
    res.status(500).json({ message: "Failed to fetch available slots" });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get appointment by ID endpoint - to be implemented" });
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete appointment endpoint - to be implemented" });
};
