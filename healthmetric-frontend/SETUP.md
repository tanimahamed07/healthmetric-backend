# HealthMetric Frontend - Setup Summary

## ✅ Project Created Successfully

### Configuration

- **Framework**: Next.js 15
- **TypeScript**: ✅ Enabled
- **Tailwind CSS**: ✅ Configured
- **App Router**: ✅ Using src/ directory
- **Shadcn UI**: ✅ Initialized with "new-york" style

### Installed Packages

#### Core Dependencies

```json
{
  "react-hook-form": "Form validation and management",
  "js-cookie": "Cookie handling",
  "@types/js-cookie": "TypeScript types for js-cookie",
  "recharts": "Chart library for data visualization",
  "date-fns": "Date utility library",
  "axios": "HTTP client for API calls"
}
```

#### Shadcn UI Components (19 components)

1. Button
2. Input
3. Label
4. Card
5. Badge
6. Dialog
7. Sheet
8. Tabs
9. Table
10. Select
11. Textarea
12. Separator
13. Avatar
14. Dropdown Menu
15. Popover
16. Calendar
17. Alert
18. Skeleton
19. Sonner (Toast notifications)

### File Structure Created

```
healthmetric-frontend/
├── src/
│   ├── app/                          # Next.js pages
│   ├── components/
│   │   └── ui/                       # 19 Shadcn components
│   ├── lib/
│   │   ├── api.ts                    # ✅ Axios instance
│   │   ├── auth.ts                   # ✅ Auth helpers
│   │   └── utils.ts                  # Shadcn utilities
│   ├── types/
│   │   └── index.ts                  # ✅ TypeScript types
│   └── middleware.ts                 # ✅ Route protection
├── .env.local                        # ✅ Environment variables
├── components.json                   # Shadcn config (new-york style)
├── README.md                         # Documentation
└── SETUP.md                          # This file
```

### Key Files Explained

#### 1. `src/lib/api.ts`

Axios instance with:

- Base URL from environment variable
- Automatic cookie sending (`withCredentials: true`)
- 401 error interceptor (redirects to login)

```typescript
import api from "@/lib/api";

// Usage example
const response = await api.get("/api/users");
const data = await api.post("/api/appointments", appointmentData);
```

#### 2. `src/lib/auth.ts`

Authentication helpers:

```typescript
import { getCurrentUser, logout } from "@/lib/auth";

// Get current user
const user = await getCurrentUser(); // Returns User | null

// Logout
await logout(); // Redirects to /auth/login
```

#### 3. `src/middleware.ts`

Route protection:

- Protects `/dashboard/*` routes
- Checks for `token` cookie
- Redirects unauthenticated users to `/auth/login`
- Redirects authenticated users away from `/auth/*`

#### 4. `src/types/index.ts`

TypeScript interfaces for:

- User, Patient, Doctor
- Appointment, Prescription, Report
- Subscription

#### 5. `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Shadcn UI Configuration

**Style**: New York
**Base Color**: Neutral
**CSS Variables**: Enabled
**Icon Library**: Lucide React

### Next Steps

1. **Start the backend**:

   ```bash
   cd ../healthmetric-backend
   npm run dev
   ```

2. **Start the frontend**:

   ```bash
   cd healthmetric-frontend
   npm run dev
   ```

3. **Build authentication pages**:
   - Create `src/app/auth/login/page.tsx`
   - Create `src/app/auth/register/page.tsx`

4. **Build dashboard**:
   - Create `src/app/dashboard/page.tsx`
   - Create role-specific layouts

5. **Implement features**:
   - Appointment booking
   - Prescription management
   - Medical reports
   - Vital signs tracking
   - Subscription/payments

### Important Notes

⚠️ **Toast Component**: The `toast` component is deprecated. Use `sonner` instead:

```typescript
import { toast } from "sonner";

// Usage
toast.success("Appointment booked!");
toast.error("Failed to save");
toast.info("New notification");
```

⚠️ **Authentication Flow**:

1. User logs in → Backend sets httpOnly cookie
2. Frontend middleware checks cookie existence
3. API calls automatically include cookie
4. Backend validates cookie on each request

⚠️ **CORS Configuration**:
Make sure your backend `.env` has:

```
FRONTEND_URL=http://localhost:3000
```

### Development Workflow

1. Backend runs on `http://localhost:5000`
2. Frontend runs on `http://localhost:3000`
3. API calls go to backend via Axios
4. Cookies are automatically handled
5. Middleware protects routes

### Troubleshooting

**Issue**: API calls fail with CORS error
**Solution**: Check backend CORS configuration and `FRONTEND_URL`

**Issue**: Middleware redirects in loop
**Solution**: Ensure backend sets cookie correctly with proper domain/path

**Issue**: Components not found
**Solution**: Check import paths use `@/` alias (configured in tsconfig.json)

### Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Recharts](https://recharts.org)
