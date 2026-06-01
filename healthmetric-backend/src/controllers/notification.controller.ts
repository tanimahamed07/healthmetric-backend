import { Response } from "express";
import { AuthRequest } from "../types";

export const createNotification = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Create notification endpoint - to be implemented" });
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get notifications endpoint - to be implemented" });
};

export const getNotificationById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get notification by ID endpoint - to be implemented" });
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({
      message: "Mark notification as read endpoint - to be implemented",
    });
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete notification endpoint - to be implemented" });
};
