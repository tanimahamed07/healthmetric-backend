import { Response } from "express";
import { AuthRequest } from "../types";

export const createAppointment = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Create appointment endpoint - to be implemented" });
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get appointments endpoint - to be implemented" });
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get appointment by ID endpoint - to be implemented" });
};

export const updateAppointment = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Update appointment endpoint - to be implemented" });
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete appointment endpoint - to be implemented" });
};
