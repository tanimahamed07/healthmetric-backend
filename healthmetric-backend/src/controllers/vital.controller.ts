import { Response } from "express";
import { AuthRequest } from "../types";
import sql from "../config/db";

export const getVitals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { type, from, to } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get patient record
    const [patient] = await sql`
      SELECT id FROM patients WHERE user_id = ${userId}
    `;

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Build query with filters
    let query = sql`
      SELECT * FROM vitals
      WHERE patient_id = ${patient.id}
    `;

    if (type) {
      query = sql`
        SELECT * FROM vitals
        WHERE patient_id = ${patient.id} AND type = ${type as string}
      `;
    }

    if (from && to) {
      query = sql`
        SELECT * FROM vitals
        WHERE patient_id = ${patient.id}
        ${type ? sql`AND type = ${type as string}` : sql``}
        AND recorded_at >= ${from as string}
        AND recorded_at <= ${to as string}
        ORDER BY recorded_at ASC
      `;
    } else {
      query = sql`
        SELECT * FROM vitals
        WHERE patient_id = ${patient.id}
        ${type ? sql`AND type = ${type as string}` : sql``}
        ORDER BY recorded_at DESC
        LIMIT 100
      `;
    }

    const vitals = await query;
    res.json(vitals);
  } catch (error) {
    console.error("Get vitals error:", error);
    res.status(500).json({ message: "Failed to fetch vitals" });
  }
};

export const createVital = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { type, value, unit, recordedAt } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!type || !value || !unit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get patient record
    const [patient] = await sql`
      SELECT id FROM patients WHERE user_id = ${userId}
    `;

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Insert vital
    const [vital] = await sql`
      INSERT INTO vitals (patient_id, type, value, unit, recorded_at)
      VALUES (${patient.id}, ${type}, ${value}, ${unit}, ${recordedAt || new Date().toISOString()})
      RETURNING *
    `;

    res.status(201).json(vital);
  } catch (error) {
    console.error("Create vital error:", error);
    res.status(500).json({ message: "Failed to create vital" });
  }
};

export const getVitalById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get vital by ID endpoint - to be implemented" });
};

export const updateVital = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Update vital endpoint - to be implemented" });
};

export const deleteVital = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete vital endpoint - to be implemented" });
};
