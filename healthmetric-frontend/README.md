# HealthMetric Frontend

A Next.js 15 frontend application for the HealthMetric healthcare platform.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (New York style)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Utilities**: date-fns

## Project Structure

```
healthmetric-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   │   └── ui/                 # Shadcn UI components
│   ├── lib/
│   │   ├── api.ts              # Axios instance with interceptors
│   │   ├── auth.ts             # Authentication helpers
│   │   └── utils.ts            # Utility functions
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── middleware.ts           # Route protection middleware
├── .env.local                  # Environment variables
└── components.json             # Shadcn UI configuration
```

## Installed Shadcn Components

- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Card
- ✅ Badge
- ✅ Dialog
- ✅ Sheet
- ✅ Tabs
- ✅ Table
- ✅ Select
- ✅ Textarea
- ✅ Separator
- ✅ Avatar
- ✅ Dropdown Menu
- ✅ Popover
- ✅ Calendar
- ✅ Alert
- ✅ Skeleton
- ✅ Sonner (Toast notifications)

## Setup Instructions

1. **Install dependencies** (already done):

   ```bash
   npm install
   ```

2. **Configure environment variables**:
   The `.env.local` file is already created with:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Start production server**:
   ```bash
   npm start
   ```

## Key Features

### API Integration (`src/lib/api.ts`)

- Axios instance configured with base URL
- Automatic cookie handling (`withCredentials: true`)
- Response interceptor for 401 errors (auto-redirect to login)

### Authentication (`src/lib/auth.ts`)

- `getCurrentUser()` - Fetches current user from `/api/auth/me`
- `logout()` - Logs out user and redirects to login page

### Route Protection (`src/middleware.ts`)

- Protects `/dashboard/*` routes - requires authentication
- Redirects to `/auth/login` if no token cookie exists
- Redirects authenticated users away from `/auth/*` pages

### Type Definitions (`src/types/index.ts`)

Includes TypeScript interfaces for:

- User
- Patient
- Doctor
- Subscription
- Appointment
- Prescription
- Report

## User Roles

- **ADMIN**: Full system access
- **DOCTOR**: Medical professional access
- **PATIENT**: Patient access

## Routes to Implement

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
- `/dashboard/subscription` - Subscription management (patients)

### Admin Routes

- `/dashboard/admin` - Admin panel
- `/dashboard/admin/users` - User management

### Doctor Routes

- `/dashboard/patients` - Patient list (doctors only)

## Next Steps

1. Create authentication pages (`/auth/login`, `/auth/register`)
2. Build dashboard layouts for each role
3. Implement appointment booking system
4. Create prescription management interface
5. Build medical reports upload/view
6. Add vital signs tracking charts
7. Implement subscription/payment flow
8. Add notification system

## Development Notes

- All API calls automatically include cookies for authentication
- Protected routes are handled by Next.js middleware
- Use `getCurrentUser()` in components to get user data
- Use Sonner for toast notifications (not the deprecated toast component)
- Shadcn components use the "New York" style variant

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
