import { Request, Response } from "express";
import { AuthRequest } from "../types";
import sql from "../config/db";

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await sql`
      SELECT 
        d.*,
        u.name,
        u.email,
        u.image
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      ORDER BY u.name ASC
    `;

    res.json(doctors);
  } catch (error) {
    console.error("Get all doctors error:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  res
    .status(501)
    .json({ message: "Get doctor by ID endpoint - to be implemented" });
};

export const updateDoctor = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Update doctor endpoint - to be implemented" });
};

export const deleteDoctor = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete doctor endpoint - to be implemented" });
};

export const getDoctorPatients = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

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
        p.user_id,
        p.blood_group,
        p.age,
        p.gender,
        u.name,
        u.email,
        u.image
      FROM patients p
      JOIN users u ON p.user_id = u.id
      JOIN appointments a ON a.patient_id = p.id
      WHERE a.doctor_id = ${doctor.id}
      ORDER BY u.name ASC
    `;

    res.json(patients);
  } catch (error) {
    console.error("Get doctor patients error:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};
