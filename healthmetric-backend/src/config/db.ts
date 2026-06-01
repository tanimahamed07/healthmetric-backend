import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 10,
});

export default sql;

// Helper function to create notifications with WebSocket
export async function createNotification(
  userId: string,
  title: string,
  message: string,
) {
  const [notification] = await sql`
    INSERT INTO notifications (user_id, title, message)
    VALUES (${userId}, ${title}, ${message})
    RETURNING *
  `;

  // Send real-time notification via WebSocket
  try {
    const { sendNotificationToUser } = await import("./socket");
    sendNotificationToUser(userId, {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.created_at,
    });
  } catch (error) {
    console.error("Failed to send WebSocket notification:", error);
  }

  return notification;
}
