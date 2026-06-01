import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import sql from "./db";

async function migrate() {
  try {
    console.log("🔄 Starting database migration...");

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'PATIENT'
          CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT')),
        image VARCHAR(500),
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Users table created");

    // Create patients table
    await sql`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blood_group VARCHAR(5),
        age INT,
        gender VARCHAR(20),
        phone VARCHAR(20),
        emergency_contact VARCHAR(100),
        medical_history TEXT
      )
    `;
    console.log("✅ Patients table created");

    // Create doctors table
    await sql`
      CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        specialization VARCHAR(100),
        experience INT,
        qualifications TEXT,
        availability JSONB DEFAULT '{}'
      )
    `;
    console.log("✅ Doctors table created");

    // Create appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
          CHECK (status IN ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED')),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Appointments table created");

    // Create prescriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        medicines JSONB NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Prescriptions table created");

    // Create reports table
    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        public_id VARCHAR(300) NOT NULL,
        report_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Reports table created");

    // Create vitals table
    await sql`
      CREATE TABLE IF NOT EXISTS vitals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        value DECIMAL NOT NULL,
        unit VARCHAR(20) NOT NULL,
        recorded_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Vitals table created");

    // Create subscriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(20) NOT NULL DEFAULT 'FREE'
          CHECK (plan IN ('FREE', 'PRO', 'PREMIUM')),
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        stripe_customer_id VARCHAR(100),
        stripe_subscription_id VARCHAR(100),
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Subscriptions table created");

    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Notifications table created");

    // Create password_reset_tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    console.log("✅ Password reset tokens table created");

    console.log("🎉 Database migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
