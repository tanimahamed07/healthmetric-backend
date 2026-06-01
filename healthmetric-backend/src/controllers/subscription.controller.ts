import { Request, Response } from "express";
import { AuthRequest } from "../types";

export const createSubscription = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Create subscription endpoint - to be implemented" });
};

export const getSubscriptions = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get subscriptions endpoint - to be implemented" });
};

export const getSubscriptionById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get subscription by ID endpoint - to be implemented" });
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Cancel subscription endpoint - to be implemented" });
};

export const handleWebhook = async (req: Request, res: Response) => {
  res
    .status(501)
    .json({ message: "Stripe webhook endpoint - to be implemented" });
};
