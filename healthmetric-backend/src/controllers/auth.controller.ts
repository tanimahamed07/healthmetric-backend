import { Request, Response } from "express";
import { AuthRequest } from "../types";

export const register = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Register endpoint - to be implemented" });
};

export const login = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Login endpoint - to be implemented" });
};

export const logout = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Logout endpoint - to be implemented" });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get current user endpoint - to be implemented" });
};
