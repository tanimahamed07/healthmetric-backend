# HealthMetric Backend

A Node.js + Express.js + TypeScript backend API for the HealthMetric healthcare platform.

## Project Structure

```
healthmetric-backend/
├── src/
│   ├── config/
│   │   └── db.ts                    # NeonDB connection using postgres.js
│   ├── middleware/
│   │   ├── auth.ts                  # JWT authentication middleware
│   │   └── rbac.ts                  # Role-based access control
│   ├── routes/
│   │   ├── auth.routes.ts           # Authentication routes
│   │   ├── patient.routes.ts        # Patient management routes
│   │   ├── doctor.routes.ts         # Doctor management routes
│   │   ├── appointment.routes.ts    # Appointment routes
│   │   ├── prescription.routes.ts   # Prescription routes
│   │   ├── report.routes.ts         # Medical report routes
│   │   ├── subscription.routes.ts   # Stripe subscription routes
│   │   ├── notification.routes.ts   # Notification routes
│   │   ├── vital.routes.ts          # Vital signs routes
│   │   └── admin.routes.ts          # Admin routes
│   ├── controllers/
│   │   └── (controller files for each route)
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── server.ts                    # Express app entry point
├── .env                             # Environment variables
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: NeonDB (PostgreSQL) via postgres.js
- **Authentication**: JWT with bcryptjs
- **File Upload**: Cloudinary + Multer
- **Payments**: Stripe
- **Email**: Resend

## Setup Instructions

1. **Install dependencies** (already done):

   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Edit the `.env` file and add your credentials:

   ```
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

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Start production server**:
   ```bash
   npm start
   ```

## API Endpoints

All routes are prefixed with `/api`:

- **Auth**: `/api/auth/*`
- **Patients**: `/api/patients/*`
- **Doctors**: `/api/doctors/*`
- **Appointments**: `/api/appointments/*`
- **Prescriptions**: `/api/prescriptions/*`
- **Reports**: `/api/reports/*`
- **Subscriptions**: `/api/subscriptions/*`
- **Notifications**: `/api/notifications/*`
- **Vitals**: `/api/vitals/*`
- **Admin**: `/api/admin/*`

## User Roles

- **ADMIN**: Full system access
- **DOCTOR**: Medical professional access
- **PATIENT**: Patient access

## Next Steps

1. Set up your NeonDB database and add the connection string to `.env`
2. Create database tables/schema
3. Implement controller logic for each endpoint
4. Add input validation
5. Set up error handling
6. Add logging
7. Write tests

## Notes

- All controllers currently return 501 (Not Implemented) - implement business logic as needed
- CORS is configured to accept requests from `FRONTEND_URL`
- JWT tokens can be sent via cookies or Authorization header
- Database connection is tested on server startup
