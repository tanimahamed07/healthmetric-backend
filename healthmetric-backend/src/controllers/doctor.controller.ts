import { Request, Response } from "express";
import { AuthRequest } from "../types";

export const getAllDoctors = async (req: Request, res: Response) => {
  res
    .status(501)
    .json({ message: "Get all doctors endpoint - to be implemented" });
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
