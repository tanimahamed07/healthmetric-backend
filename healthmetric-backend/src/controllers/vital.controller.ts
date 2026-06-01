import { Response } from "express";
import { AuthRequest } from "../types";

export const createVital = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Create vital endpoint - to be implemented" });
};

export const getVitals = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ message: "Get vitals endpoint - to be implemented" });
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
