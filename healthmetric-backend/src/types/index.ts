import { Request } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
