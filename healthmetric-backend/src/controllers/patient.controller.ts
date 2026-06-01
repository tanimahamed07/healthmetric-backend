import { Response } from "express";
import { AuthRequest } from "../types";

export const getAllPatients = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get all patients endpoint - to be implemented" });
};

export const getPatientById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get patient by ID endpoint - to be implemented" });
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Update patient endpoint - to be implemented" });
};

export const deletePatient = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete patient endpoint - to be implemented" });
};
