# HealthMetric Testing Guide

## Setup Complete ✅

### Backend

- ✅ Server running on `http://localhost:5001`
- ✅ Database connected (NeonDB)
- ✅ All tables created
- ✅ Test data seeded

### Frontend

- ✅ Dashboard pages created for all roles
- ✅ API endpoints fixed
- ✅ Connected to backend on port 5001

## How to Test

### 1. Start Backend

```bash
cd healthmetric-backend
npm run dev
```

Should see:

```
✅ Database connected successfully
🚀 Server running on port 5001
🔌 WebSocket server initialized
```

### 2. Start Frontend

```bash
cd healthmetric-frontend
npm run dev
```

Should run on: `http://localhost:3000`

### 3. Test Login Flow

#### Test as Patient

1. Go to `http://localhost:3000/auth/login`
2. Login with:
   - Email: `john.doe@example.com`
   - Password: `password123`
3. Should redirect to: `/dashboard/patient`
4. You should see:
   - Stats cards (appointments, reports, prescriptions, notifications)
   - Quick action buttons

#### Test as Doctor

1. Go to `http://localhost:3000/auth/login`
2. Login with:
   - Email: `sarah.johnson@healthmetric.com`
   - Password: `password123`
3. Should redirect to: `/dashboard/doctor`
4. You should see:
   - Today's appointments
   - Pending requests
   - Total patients
   - Quick actions

#### Test as Admin

1. Go to `http://localhost:3000/auth/login`
2. Login with:
   - Email: `admin@healthmetric.com`
   - Password: `password123`
3. Should redirect to: `/dashboard/admin`
4. You should see:
   - Total users
   - Doctors count
   - Patients count
   - Premium users

### 4. Test Registration

1. Go to `http://localhost:3000/auth/register`
2. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Role: Patient or Doctor
3. Click "Create Account"
4. Should see success message
5. Click "Go to Login"
6. Login with your new credentials

## API Endpoints Working

### Authentication

- ✅ `POST /auth/register` - Register new user
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/logout` - Logout
- ✅ `GET /auth/me` - Get current user

### Appointments

- ✅ `GET /appointments` - Get user's appointments
- ✅ `POST /appointments` - Create appointment
- ✅ `PATCH /appointments/:id` - Update status
- ✅ `GET /appointments/slots` - Get available slots

### Prescriptions

- ✅ `GET /prescriptions` - Get prescriptions
- ✅ `POST /prescriptions` - Create prescription
- ✅ `GET /prescriptions/:id` - Get details

### Reports

- ✅ `GET /reports` - Get patient reports
- ✅ `POST /reports` - Upload report
- ✅ `DELETE /reports/:id` - Delete report

### Vitals

- ✅ `GET /vitals` - Get vitals
- ✅ `POST /vitals` - Log vital

### Notifications

- ✅ `GET /notifications` - Get notifications
- ✅ `PATCH /notifications/read-all` - Mark all read

### Doctors

- ✅ `GET /doctors` - Get all doctors
- ✅ `GET /doctors/:id` - Get doctor by ID

### Admin

- ✅ `GET /admin/dashboard` - Get stats
- ✅ `GET /admin/users` - Get all users

## Common Issues

### Port 5000 in use

```bash
lsof -i:5000
kill -9 <PID>
```

Or change to port 5001 (already done)

### Database connection failed

- Check `.env` file has correct `DATABASE_URL`
- Remove `channel_binding=require` from URL

### Frontend can't connect to backend

- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5001`
- Make sure backend is running

### 404 after login

- Dashboard pages are now created
- Make sure frontend dev server restarted after creating pages

## Next Steps

1. ✅ Login/Register working
2. ✅ Dashboard pages created
3. ⏳ Create remaining feature pages:
   - Appointments page
   - Reports page
   - Prescriptions page
   - Analytics page
   - Admin pages
4. ⏳ Test full user flows
5. ⏳ Add WebSocket notifications
6. ⏳ Deploy to production

## Test Credentials

### Admin

- Email: `admin@healthmetric.com`
- Password: `password123`

### Doctors

- Email: `sarah.johnson@healthmetric.com`
- Password: `password123`
- Specialization: Cardiology

- Email: `michael.chen@healthmetric.com`
- Password: `password123`
- Specialization: General Practice

### Patients

- Email: `john.doe@example.com`
- Password: `password123`

- Email: `jane.smith@example.com`
- Password: `password123`

- Email: `robert.brown@example.com`
- Password: `password123`
