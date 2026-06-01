import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
  max: 10,
});

export default sql;

// Helper function to create notifications
export async function createNotification(
  userId: string,
  title: string,
  message: string,
) {
  await sql`
    INSERT INTO notifications (user_id, title, message)
    VALUES (${userId}, ${title}, ${message})
  `;
}
