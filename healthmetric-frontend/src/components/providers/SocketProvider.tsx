"use client";

import { useEffect } from "react";
import { initializeSocket, disconnectSocket } from "@/lib/socket";
import { usePathname } from "next/navigation";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    if (isDashboard) {
      // Initialize socket when user is in dashboard
      const socket = initializeSocket();

      return () => {
        // Cleanup on unmount
        disconnectSocket();
      };
    }
  }, [isDashboard]);

  return <>{children}</>;
}
