import { Response } from "express";
import { AuthRequest } from "../types";
import sql, { createNotification } from "../config/db";

export const getPrescriptions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "PATIENT") {
      // Get patient's prescriptions
      const [patient] = await sql`
        SELECT id FROM patients WHERE user_id = ${userId}
      `;

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const prescriptions = await sql`
        SELECT 
          p.*,
          d.specialization,
          u.name as doctor_name,
          u.image as doctor_image
        FROM prescriptions p
        JOIN doctors d ON p.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE p.patient_id = ${patient.id}
        ORDER BY p.created_at DESC
      `;

      res.json(prescriptions);
    } else if (role === "DOCTOR") {
      // Get doctor's prescriptions
      const [doctor] = await sql`
        SELECT id FROM doctors WHERE user_id = ${userId}
      `;

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const prescriptions = await sql`
        SELECT 
          p.*,
          u.name as patient_name,
          u.image as patient_image
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.id
        JOIN users u ON pt.user_id = u.id
        WHERE p.doctor_id = ${doctor.id}
        ORDER BY p.created_at DESC
      `;

      res.json(prescriptions);
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Get prescriptions error:", error);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
};

export const createPrescription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { patientId, medicines, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role !== "DOCTOR") {
      return res
        .status(403)
        .json({ message: "Only doctors can create prescriptions" });
    }

    if (
      !patientId ||
      !medicines ||
      !Array.isArray(medicines) ||
      medicines.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get doctor record
    const [doctor] = await sql`
      SELECT id FROM doctors WHERE user_id = ${userId}
    `;

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get patient user_id for notification
    const [patient] = await sql`
      SELECT user_id FROM patients WHERE id = ${patientId}
    `;

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create prescription with medicines as JSONB
    const [prescription] = await sql`
      INSERT INTO prescriptions (patient_id, doctor_id, medicines, notes)
      VALUES (${patientId}, ${doctor.id}, ${JSON.stringify(medicines)}, ${
        notes || null
      })
      RETURNING *
    `;

    // Notify patient
    await createNotification(
      patient.user_id,
      "New Prescription",
      `You have received a new prescription with ${medicines.length} medicine(s)`,
    );

    res.status(201).json(prescription);
  } catch (error) {
    console.error("Create prescription error:", error);
    res.status(500).json({ message: "Failed to create prescription" });
  }
};

export const getPrescriptionById = async (req: AuthRequest, res: Response) => {
  try {
    const prescriptionId = req.params.id;

    // Get prescription with doctor and patient details
    const [prescription] = await sql`
      SELECT 
        p.*,
        d.specialization,
        d.qualifications,
        du.name as doctor_name,
        du.email as doctor_email,
        du.image as doctor_image,
        pt.blood_group,
        pt.age,
        pt.gender,
        pu.name as patient_name,
        pu.email as patient_email,
        pu.image as patient_image
      FROM prescriptions p
      JOIN doctors d ON p.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      JOIN patients pt ON p.patient_id = pt.id
      JOIN users pu ON pt.user_id = pu.id
      WHERE p.id = ${prescriptionId}
    `;

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (error) {
    console.error("Get prescription by ID error:", error);
    res.status(500).json({ message: "Failed to fetch prescription" });
  }
};

export const updatePrescription = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Update prescription endpoint - to be implemented" });
};

export const deletePrescription = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete prescription endpoint - to be implemented" });
};
