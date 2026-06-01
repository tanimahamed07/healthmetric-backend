# HealthMetric Backend - Server Ready ✅

## Status

- ✅ Database connected successfully (NeonDB)
- ✅ All tables created (10 tables)
- ✅ Test data seeded (1 admin, 2 doctors, 3 patients)
- ✅ TypeScript errors fixed
- ✅ Server ready to run

## How to Start Server

```bash
cd healthmetric-backend
npm run dev
```

Server will run on: **http://localhost:5000**

## Test Credentials

### Admin

- Email: `admin@healthmetric.com`
- Password: `password123`

### Doctor

- Email: `sarah.johnson@healthmetric.com`
- Password: `password123`

### Patient

- Email: `john.doe@example.com`
- Password: `password123`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Appointments

- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id` - Update appointment status
- `GET /api/appointments/slots` - Get available time slots

### Prescriptions

- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription (doctor only)
- `GET /api/prescriptions/:id` - Get prescription details

### Reports

- `GET /api/reports` - Get patient reports
- `POST /api/reports` - Upload report
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/patient/:patientId` - Get patient reports (doctor only)

### Vitals

- `GET /api/vitals` - Get vitals with filters
- `POST /api/vitals` - Log vital

### Subscriptions

- `GET /api/subscriptions` - Get user subscription
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Stripe webhook
- `POST /api/stripe/portal` - Create billing portal session

### Notifications

- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/read-all` - Mark all as read

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PATCH /api/doctors/:id` - Update doctor profile
- `GET /api/doctors/:id/patients` - Get doctor's patients

### Admin

- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users (paginated)
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Upload

- `POST /api/upload-cloudinary` - Upload file to Cloudinary

## WebSocket Events

Server emits real-time notifications via Socket.IO:

- Event: `notification`
- Payload: `{ id, title, message, createdAt }`

## Next Steps

1. ✅ Backend server is running
2. ⏳ Test registration endpoint
3. ⏳ Start frontend development server
4. ⏳ Test login flow
5. ⏳ Build remaining frontend pages

## Troubleshooting

### Port 5000 already in use

```bash
lsof -ti:5000 | xargs kill -9
npm run dev
```

### Database connection issues

- Check `.env` file has correct `DATABASE_URL`
- Ensure NeonDB is accessible
- Run test: `node test-db.js`

### Migration issues

```bash
npx ts-node src/config/migrate.ts
npx ts-node src/config/seed.ts
```
