import { Response } from "express";
import { AuthRequest } from "../types";

export const getDashboard = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get admin dashboard endpoint - to be implemented" });
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get all users endpoint - to be implemented" });
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ message: "Update user endpoint - to be implemented" });
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ message: "Delete user endpoint - to be implemented" });
};
