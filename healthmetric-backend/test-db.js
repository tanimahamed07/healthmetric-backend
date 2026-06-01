require("dotenv").config();
const postgres = require("postgres");

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Found" : "NOT FOUND");
console.log("First 50 chars:", process.env.DATABASE_URL?.substring(0, 50));

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1,
});

async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log("✅ Database connection successful!");
    console.log("Current time from DB:", result[0].current_time);
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Error code:", error.code);
    process.exit(1);
  }
}

testConnection();
