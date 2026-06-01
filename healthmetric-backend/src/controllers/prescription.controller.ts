import { Response } from "express";
import { AuthRequest } from "../types";

export const createPrescription = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Create prescription endpoint - to be implemented" });
};

export const getPrescriptions = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get prescriptions endpoint - to be implemented" });
};

export const getPrescriptionById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get prescription by ID endpoint - to be implemented" });
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
