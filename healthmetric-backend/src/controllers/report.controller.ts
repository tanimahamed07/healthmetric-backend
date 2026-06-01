import { Response } from "express";
import { AuthRequest } from "../types";
import sql from "../config/db";
import cloudinary from "../config/cloudinary";

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get patient record
    const [patient] = await sql`
      SELECT id FROM patients WHERE user_id = ${userId}
    `;

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get all reports for this patient, ordered by created_at DESC
    const reports = await sql`
      SELECT * FROM reports 
      WHERE patient_id = ${patient.id}
      ORDER BY created_at DESC
    `;

    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title, fileUrl, publicId, reportType } = req.body;

    if (!title || !fileUrl || !publicId || !reportType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get patient record
    const [patient] = await sql`
      SELECT id FROM patients WHERE user_id = ${userId}
    `;

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Insert report
    const [report] = await sql`
      INSERT INTO reports (patient_id, title, file_url, public_id, report_type)
      VALUES (${patient.id}, ${title}, ${fileUrl}, ${publicId}, ${reportType})
      RETURNING *
    `;

    res.status(201).json(report);
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Failed to create report" });
  }
};

export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const reportId = req.params.id;

    // Get patient record
    const [patient] = await sql`
      SELECT id FROM patients WHERE user_id = ${userId}
    `;

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get report and verify ownership
    const [report] = await sql`
      SELECT * FROM reports 
      WHERE id = ${reportId} AND patient_id = ${patient.id}
    `;

    if (!report) {
      return res
        .status(404)
        .json({ message: "Report not found or unauthorized" });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(report.public_id);
    } catch (cloudinaryError) {
      console.error("Cloudinary delete error:", cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await sql`
      DELETE FROM reports WHERE id = ${reportId}
    `;

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({ message: "Failed to delete report" });
  }
};

export const getReportsByPatient = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const patientId = req.params.patientId;

    // Verify user is a doctor
    const [doctor] = await sql`
      SELECT id FROM doctors WHERE user_id = ${userId}
    `;

    if (!doctor) {
      return res
        .status(403)
        .json({ message: "Only doctors can access patient reports" });
    }

    // Verify doctor has appointment with this patient
    const [appointment] = await sql`
      SELECT id FROM appointments 
      WHERE doctor_id = ${doctor.id} AND patient_id = ${patientId}
      LIMIT 1
    `;

    if (!appointment) {
      return res
        .status(403)
        .json({ message: "No appointment found with this patient" });
    }

    // Get reports for this patient
    const reports = await sql`
      SELECT * FROM reports 
      WHERE patient_id = ${patientId}
      ORDER BY created_at DESC
    `;

    res.json(reports);
  } catch (error) {
    console.error("Get patient reports error:", error);
    res.status(500).json({ message: "Failed to fetch patient reports" });
  }
};

export const getReportById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get report by ID endpoint - to be implemented" });
};

export const updateReport = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Update report endpoint - to be implemented" });
};
