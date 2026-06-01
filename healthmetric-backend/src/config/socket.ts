import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

let io: Server;

// Store user socket connections
const userSockets = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`✅ User connected: ${userId}`);

    // Store socket connection
    userSockets.set(userId, socket.id);

    // Send connection confirmation
    socket.emit("connected", { userId });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${userId}`);
      userSockets.delete(userId);
    });

    // Handle mark notification as read
    socket.on("mark-notification-read", (notificationId: string) => {
      console.log(
        `📖 Notification ${notificationId} marked as read by ${userId}`,
      );
    });

    // Handle mark all as read
    socket.on("mark-all-read", () => {
      console.log(`📖 All notifications marked as read by ${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

// Send notification to specific user
export const sendNotificationToUser = (
  userId: string,
  notification: {
    id: string;
    title: string;
    message: string;
    createdAt: string;
  },
) => {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit("notification", notification);
    console.log(`📨 Notification sent to user ${userId}`);
  }
};

// Broadcast notification to all users
export const broadcastNotification = (notification: {
  title: string;
  message: string;
}) => {
  if (io) {
    io.emit("broadcast", notification);
    console.log("📢 Notification broadcasted to all users");
  }
};

export { userSockets };
