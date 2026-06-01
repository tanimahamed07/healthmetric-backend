import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const validateUserId = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: "User ID not found" });
  }
  next();
};
