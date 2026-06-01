import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sql from "./config/db";

// Import routes
import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patient.routes";
import doctorRoutes from "./routes/doctor.routes";
import appointmentRoutes from "./routes/appointment.routes";
import prescriptionRoutes from "./routes/prescription.routes";
import reportRoutes from "./routes/report.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import notificationRoutes from "./routes/notification.routes";
import vitalRoutes from "./routes/vital.routes";
import adminRoutes from "./routes/admin.routes";
import { upload, uploadToCloudinary } from "./controllers/upload.controller";
import { authenticate } from "./middleware/auth";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/admin", adminRoutes);

// Upload route
app.post(
  "/api/upload-cloudinary",
  authenticate,
  upload.single("file"),
  uploadToCloudinary,
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "HealthMetric API is running" });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sql`SELECT 1`;
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
