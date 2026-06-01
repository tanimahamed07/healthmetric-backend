import { Response } from "express";
import { AuthRequest } from "../types";
import sql from "../config/db";

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // Get stats for admin dashboard
    const [userStats] = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE role = 'PATIENT') as total_patients,
        COUNT(*) FILTER (WHERE role = 'DOCTOR') as total_doctors
      FROM users
    `;

    const [subscriptionStats] = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE plan = 'FREE') as free_count,
        COUNT(*) FILTER (WHERE plan = 'PRO') as pro_count,
        COUNT(*) FILTER (WHERE plan = 'PREMIUM') as premium_count
      FROM subscriptions
    `;

    const [appointmentStats] = await sql`
      SELECT 
        COUNT(*) as total_appointments,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_appointments,
        COUNT(*) FILTER (WHERE status = 'APPROVED') as approved_appointments
      FROM appointments
    `;

    res.json({
      users: userStats,
      subscriptions: subscriptionStats,
      appointments: appointmentStats,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", search = "" } = req.query;
    const limit = 20;
    const offset = (parseInt(page as string) - 1) * limit;

    let users;
    let totalCount;

    if (search) {
      users = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.created_at,
          s.plan
        FROM users u
        LEFT JOIN subscriptions s ON u.id = s.user_id
        WHERE u.name ILIKE ${"%" + search + "%"} OR u.email ILIKE ${"%" + search + "%"}
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      [totalCount] = await sql`
        SELECT COUNT(*) as count FROM users
        WHERE name ILIKE ${"%" + search + "%"} OR email ILIKE ${"%" + search + "%"}
      `;
    } else {
      users = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.created_at,
          s.plan
        FROM users u
        LEFT JOIN subscriptions s ON u.id = s.user_id
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      [totalCount] = await sql`
        SELECT COUNT(*) as count FROM users
      `;
    }

    res.json({
      users,
      total: parseInt(totalCount.count),
      page: parseInt(page as string),
      totalPages: Math.ceil(parseInt(totalCount.count) / limit),
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !["ADMIN", "DOCTOR", "PATIENT"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await sql`
      UPDATE users
      SET role = ${role}
      WHERE id = ${userId}
    `;

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    // Delete user (cascade will handle related records)
    await sql`
      DELETE FROM users WHERE id = ${userId}
    `;

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
