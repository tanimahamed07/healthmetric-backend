import { Response } from "express";
import { AuthRequest } from "../types";
import sql from "../config/db";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get last 20 notifications, unread first
    const notifications = await sql`
      SELECT * FROM notifications
      WHERE user_id = ${userId}
      ORDER BY read ASC, created_at DESC
      LIMIT 20
    `;

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await sql`
      UPDATE notifications
      SET read = true
      WHERE user_id = ${userId} AND read = false
    `;

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

export const createNotification = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Create notification endpoint - to be implemented" });
};

export const getNotificationById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get notification by ID endpoint - to be implemented" });
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  res.status(501).json({
    message: "Mark notification as read endpoint - to be implemented",
  });
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Delete notification endpoint - to be implemented" });
};
