import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import sql from "./db";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Admin
    const [admin] = await sql`
      INSERT INTO users (name, email, password, role, email_verified)
      VALUES ('Admin User', 'admin@healthmetric.com', ${hashedPassword}, 'ADMIN', true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;

    if (admin) {
      await sql`
        INSERT INTO subscriptions (user_id, plan, status)
        VALUES (${admin.id}, 'FREE', 'active')
        ON CONFLICT (user_id) DO NOTHING
      `;
      console.log("✅ Admin user created");
    }

    // Create Doctors
    const doctors = [
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@healthmetric.com",
        specialization: "Cardiology",
        experience: 15,
        qualifications: "MD, FACC",
        availability: {
          Monday: { available: true, start: "09:00", end: "17:00" },
          Tuesday: { available: true, start: "09:00", end: "17:00" },
          Wednesday: { available: true, start: "09:00", end: "17:00" },
          Thursday: { available: true, start: "09:00", end: "17:00" },
          Friday: { available: true, start: "09:00", end: "15:00" },
          Saturday: { available: false, start: "", end: "" },
          Sunday: { available: false, start: "", end: "" },
        },
      },
      {
        name: "Dr. Michael Chen",
        email: "michael.chen@healthmetric.com",
        specialization: "General Practice",
        experience: 10,
        qualifications: "MD, MBBS",
        availability: {
          Monday: { available: true, start: "10:00", end: "18:00" },
          Tuesday: { available: true, start: "10:00", end: "18:00" },
          Wednesday: { available: true, start: "10:00", end: "18:00" },
          Thursday: { available: true, start: "10:00", end: "18:00" },
          Friday: { available: true, start: "10:00", end: "16:00" },
          Saturday: { available: true, start: "10:00", end: "14:00" },
          Sunday: { available: false, start: "", end: "" },
        },
      },
    ];

    for (const doctor of doctors) {
      const [user] = await sql`
        INSERT INTO users (name, email, password, role, email_verified)
        VALUES (${doctor.name}, ${doctor.email}, ${hashedPassword}, 'DOCTOR', true)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;

      if (user) {
        await sql`
          INSERT INTO doctors (user_id, specialization, experience, qualifications, availability)
          VALUES (${user.id}, ${doctor.specialization}, ${doctor.experience}, ${doctor.qualifications}, ${JSON.stringify(doctor.availability)})
          ON CONFLICT (user_id) DO NOTHING
        `;

        await sql`
          INSERT INTO subscriptions (user_id, plan, status)
          VALUES (${user.id}, 'FREE', 'active')
          ON CONFLICT (user_id) DO NOTHING
        `;

        console.log(`✅ Doctor created: ${doctor.name}`);
      }
    }

    // Create Patients
    const patients = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        bloodGroup: "O+",
        age: 35,
        gender: "Male",
        phone: "+1234567890",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        bloodGroup: "A+",
        age: 28,
        gender: "Female",
        phone: "+1234567891",
      },
      {
        name: "Robert Brown",
        email: "robert.brown@example.com",
        bloodGroup: "B+",
        age: 42,
        gender: "Male",
        phone: "+1234567892",
      },
    ];

    for (const patient of patients) {
      const [user] = await sql`
        INSERT INTO users (name, email, password, role, email_verified)
        VALUES (${patient.name}, ${patient.email}, ${hashedPassword}, 'PATIENT', true)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;

      if (user) {
        await sql`
          INSERT INTO patients (user_id, blood_group, age, gender, phone)
          VALUES (${user.id}, ${patient.bloodGroup}, ${patient.age}, ${patient.gender}, ${patient.phone})
          ON CONFLICT (user_id) DO NOTHING
        `;

        await sql`
          INSERT INTO subscriptions (user_id, plan, status)
          VALUES (${user.id}, 'FREE', 'active')
          ON CONFLICT (user_id) DO NOTHING
        `;

        console.log(`✅ Patient created: ${patient.name}`);
      }
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nTest Credentials:");
    console.log("==================");
    console.log("Admin:");
    console.log("  Email: admin@healthmetric.com");
    console.log("  Password: password123");
    console.log("\nDoctor:");
    console.log("  Email: sarah.johnson@healthmetric.com");
    console.log("  Password: password123");
    console.log("\nPatient:");
    console.log("  Email: john.doe@example.com");
    console.log("  Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
