import { Request, Response } from "express";
import { AuthRequest } from "../types";
import sql from "../config/db";

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await sql`
      SELECT 
        d.id,
        d.specialization,
        d.experience,
        d.qualifications,
        d.availability,
        u.id as user_id,
        u.name,
        u.email,
        u.image
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.role = 'DOCTOR'
      ORDER BY u.name ASC
    `;

    // Format response
    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.id,
      userId: doctor.user_id,
      specialization: doctor.specialization,
      experience: doctor.experience,
      qualifications: doctor.qualifications,
      availability: doctor.availability,
      user: {
        name: doctor.name,
        email: doctor.email,
        image: doctor.image,
      },
    }));

    res.json(formattedDoctors);
  } catch (error) {
    console.error("Get all doctors error:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.id;

    const [doctor] = await sql`
      SELECT 
        d.*,
        u.name,
        u.email,
        u.image
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ${doctorId}
    `;

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      id: doctor.id,
      userId: doctor.user_id,
      specialization: doctor.specialization,
      experience: doctor.experience,
      qualifications: doctor.qualifications,
      availability: doctor.availability,
      user: {
        name: doctor.name,
        email: doctor.email,
        image: doctor.image,
      },
    });
  } catch (error) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({ message: "Failed to fetch doctor" });
  }
};

export const updateDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const doctorId = req.params.id;
    const { specialization, experience, qualifications, availability } =
      req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify doctor owns this record
    const [doctor] = await sql`
      SELECT id FROM doctors WHERE user_id = ${userId}
    `;

    if (!doctor || doctor.id !== doctorId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update doctor
    await sql`
      UPDATE doctors
      SET 
        specialization = COALESCE(${specialization}, specialization),
        experience = COALESCE(${experience}, experience),
        qualifications = COALESCE(${qualifications}, qualifications),
        availability = COALESCE(${availability ? JSON.stringify(availability) : null}, availability)
      WHERE id = ${doctorId}
    `;

    res.json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({ message: "Failed to update doctor" });
  }
};

export const deleteDoctor = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete doctor endpoint - to be implemented" });
};

export const getDoctorPatients = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get doctor record
    const [doctor] = await sql`
      SELECT id FROM doctors WHERE user_id = ${userId}
    `;

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get patients who have appointments with this doctor
    const patients = await sql`
      SELECT DISTINCT
        p.id,
        p.blood_group,
        p.age,
        p.gender,
        p.phone,
        u.id as user_id,
        u.name,
        u.email,
        u.image
      FROM patients p
      JOIN users u ON p.user_id = u.id
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.doctor_id = ${doctor.id}
      ORDER BY u.name ASC
    `;

    // Format response
    const formattedPatients = patients.map((patient) => ({
      id: patient.id,
      userId: patient.user_id,
      bloodGroup: patient.blood_group,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      user: {
        name: patient.name,
        email: patient.email,
        image: patient.image,
      },
    }));

    res.json(formattedPatients);
  } catch (error) {
    console.error("Get doctor patients error:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};
