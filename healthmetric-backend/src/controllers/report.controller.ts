import { Response } from "express";
import { AuthRequest } from "../types";

export const createReport = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Create report endpoint - to be implemented" });
};

export const getReports = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ message: "Get reports endpoint - to be implemented" });
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

export const deleteReport = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete report endpoint - to be implemented" });
};
