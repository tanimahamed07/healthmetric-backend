# HealthMetric - Full Stack Healthcare Management Platform

A comprehensive healthcare management system built with modern web technologies.

## 🏗️ Architecture

### Backend: Node.js + Express + TypeScript

**Location**: `healthmetric-backend/`

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: NeonDB (PostgreSQL) via postgres.js
- **Authentication**: JWT with bcryptjs
- **File Storage**: Cloudinary
- **Payments**: Stripe
- **Email**: Resend

### Frontend: Next.js 15 + TypeScript

**Location**: `healthmetric-frontend/`

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (New York style)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **HTTP Client**: Axios

## 📁 Project Structure

```
.
├── healthmetric-backend/          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # Database connection
│   │   │   └── migrate.ts         # Database migration script
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT authentication
│   │   │   └── rbac.ts            # Role-based access control
│   │   ├── routes/                # API routes (10 files)
│   │   ├── controllers/           # Route controllers (10 files)
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript types
│   │   └── server.ts              # Express app entry
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── healthmetric-frontend/         # Frontend application
    ├── src/
    │   ├── app/                   # Next.js pages (App Router)
    │   ├── components/
    │   │   └── ui/                # Shadcn UI components (19)
    │   ├── lib/
    │   │   ├── api.ts             # Axios instance
    │   │   ├── auth.ts            # Auth helpers
    │   │   └── utils.ts           # Utilities
    │   ├── types/
    │   │   └── index.ts           # TypeScript types
    │   └── middleware.ts          # Route protection
    ├── .env.local                 # Environment variables
    └── package.json
```

## 🗄️ Database Schema

### Tables (10)

1. **users** - User accounts (admin, doctor, patient)
2. **patients** - Patient-specific information
3. **doctors** - Doctor profiles and availability
4. **appointments** - Appointment bookings
5. **prescriptions** - Medical prescriptions
6. **reports** - Medical reports with file storage
7. **vitals** - Patient vital signs tracking
8. **subscriptions** - Stripe subscription management
9. **notifications** - User notifications
10. **password_reset_tokens** - Password reset functionality

## 🔐 User Roles

- **ADMIN**: Full system access, user management
- **DOCTOR**: Patient management, appointments, prescriptions
- **PATIENT**: Book appointments, view prescriptions, track vitals

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- NeonDB account (PostgreSQL database)
- Cloudinary account (file storage)
- Stripe account (payments)
- Resend account (emails)

### Backend Setup

1. **Navigate to backend**:

   ```bash
   cd healthmetric-backend
   ```

2. **Configure environment** (`.env`):

   ```env
   DATABASE_URL=your_neondb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   RESEND_API_KEY=your_resend_key
   ```

3. **Run database migration**:

   ```bash
   npx ts-node src/config/migrate.ts
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**:

   ```bash
   cd healthmetric-frontend
   ```

2. **Environment is already configured** (`.env.local`):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## 📡 API Endpoints

All routes prefixed with `/api`:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patients

- `GET /api/patients` - List patients (admin/doctor)
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (admin)

### Doctors

- `GET /api/doctors` - List doctors (public)
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor (admin)

### Appointments

- `POST /api/appointments` - Book appointment (patient)
- `GET /api/appointments` - List appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Prescriptions

- `POST /api/prescriptions` - Create prescription (doctor)
- `GET /api/prescriptions` - List prescriptions
- `GET /api/prescriptions/:id` - Get prescription details
- `PUT /api/prescriptions/:id` - Update prescription (doctor)
- `DELETE /api/prescriptions/:id` - Delete prescription

### Reports

- `POST /api/reports` - Upload report
- `GET /api/reports` - List reports
- `GET /api/reports/:id` - Get report details
- `PUT /api/reports/:id` - Update report (doctor)
- `DELETE /api/reports/:id` - Delete report

### Vitals

- `POST /api/vitals` - Record vital signs
- `GET /api/vitals` - List vitals
- `GET /api/vitals/:id` - Get vital details
- `PUT /api/vitals/:id` - Update vital
- `DELETE /api/vitals/:id` - Delete vital

### Subscriptions

- `POST /api/subscriptions/create` - Create subscription (patient)
- `GET /api/subscriptions` - List subscriptions
- `GET /api/subscriptions/:id` - Get subscription details
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/webhook` - Stripe webhook

### Notifications

- `POST /api/notifications` - Create notification
- `GET /api/notifications` - List notifications
- `GET /api/notifications/:id` - Get notification details
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin

- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Frontend Routes

### Public Routes

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Protected Routes (Dashboard)

- `/dashboard` - Main dashboard (role-specific)
- `/dashboard/appointments` - Appointments management
- `/dashboard/prescriptions` - Prescriptions view
- `/dashboard/reports` - Medical reports
- `/dashboard/vitals` - Vital signs tracking
- `/dashboard/profile` - User profile
- `/dashboard/subscription` - Subscription management

### Admin Routes

- `/dashboard/admin` - Admin panel
- `/dashboard/admin/users` - User management

### Doctor Routes

- `/dashboard/patients` - Patient list

## 🔒 Security Features

### Backend

- JWT authentication with httpOnly cookies
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- CORS configuration
- SQL injection prevention (parameterized queries)
- Input validation

### Frontend

- Route protection via middleware
- Automatic token refresh
- 401 error handling
- Secure cookie storage
- XSS prevention

## 📦 Installed Packages

### Backend Dependencies

```json
{
  "express": "Web framework",
  "cors": "CORS middleware",
  "dotenv": "Environment variables",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "cookie-parser": "Cookie parsing",
  "postgres": "PostgreSQL client",
  "cloudinary": "File storage",
  "multer": "File upload",
  "stripe": "Payment processing",
  "resend": "Email service"
}
```

### Frontend Dependencies

```json
{
  "next": "React framework",
  "react": "UI library",
  "react-hook-form": "Form management",
  "axios": "HTTP client",
  "recharts": "Charts",
  "date-fns": "Date utilities",
  "js-cookie": "Cookie handling",
  "shadcn-ui": "UI components"
}
```

## 🎯 Next Steps

### Backend

1. Implement controller logic for all endpoints
2. Add input validation (e.g., Zod, Joi)
3. Set up error handling middleware
4. Add logging (e.g., Winston, Pino)
5. Write unit and integration tests
6. Set up CI/CD pipeline

### Frontend

1. Create authentication pages (login/register)
2. Build dashboard layouts for each role
3. Implement appointment booking UI
4. Create prescription management interface
5. Build medical reports upload/view
6. Add vital signs tracking with charts
7. Implement subscription/payment flow
8. Add notification system UI

## 🛠️ Development Workflow

1. Start backend: `cd healthmetric-backend && npm run dev`
2. Start frontend: `cd healthmetric-frontend && npm run dev`
3. Backend runs on port 5000
4. Frontend runs on port 3000
5. Make changes and test
6. Commit and push

## 📝 Notes

- All backend controllers return 501 (Not Implemented) - implement business logic
- Frontend middleware checks for token cookie to protect routes
- API calls automatically include cookies via Axios configuration
- Database migration creates all tables with proper relationships
- Use Sonner for toast notifications (not deprecated toast component)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ for better healthcare management**
