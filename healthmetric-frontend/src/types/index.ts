export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  image?: string;
}

export interface Patient {
  id: string;
  userId: string;
  bloodGroup?: string;
  age?: number;
  gender?: string;
  phone?: string;
  emergencyContact?: string;
  medicalHistory?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization?: string;
  experience?: number;
  qualifications?: string;
  availability?: Record<
    string,
    { start: string; end: string; available: boolean }
  >;
}

export interface Subscription {
  plan: "FREE" | "PRO" | "PREMIUM";
  status: string;
  expiresAt?: string;
}

export interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  doctor?: Doctor & { user: User };
  patient?: Patient & { user: User };
}

export interface Prescription {
  id: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  notes?: string;
  createdAt: string;
  doctor?: Doctor & { user: User };
}

export interface Report {
  id: string;
  title: string;
  fileUrl: string;
  reportType: string;
  createdAt: string;
}
