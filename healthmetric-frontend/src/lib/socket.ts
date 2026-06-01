import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = Cookies.get("token");

  if (!token) {
    console.warn("No token found, cannot initialize socket");
    return null;
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("✅ WebSocket connected");
  });

  socket.on("disconnect", () => {
    console.log("❌ WebSocket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;
