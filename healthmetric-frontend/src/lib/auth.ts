import api from "./api";
import { User } from "@/types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout");
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout failed:", error);
    // Redirect anyway
    window.location.href = "/auth/login";
  }
}
