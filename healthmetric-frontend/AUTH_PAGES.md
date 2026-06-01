# Authentication Pages Documentation

All authentication pages have been created using Shadcn UI and React Hook Form with built-in validation rules.

## Pages Created

### 1. Login Page (`/auth/login`)

**Location**: `src/app/auth/login/page.tsx`

**Features**:

- Email and password fields
- Built-in validation:
  - Email: required, valid email pattern
  - Password: required, minimum 6 characters
- Role-based redirect after successful login:
  - PATIENT → `/dashboard/patient`
  - DOCTOR → `/dashboard/doctor`
  - ADMIN → `/dashboard/admin`
- Error message display below form
- Links to register and forgot password pages
- Loading spinner during submission

**API Endpoint**: `POST /api/auth/login`

**Form Fields**:

```typescript
{
  email: string; // required, email pattern
  password: string; // required, minLength: 6
}
```

---

### 2. Register Page (`/auth/register`)

**Location**: `src/app/auth/register/page.tsx`

**Features**:

- Full name, email, password, confirm password, and role fields
- Built-in validation:
  - Name: required
  - Email: required, valid email pattern
  - Password: required, minimum 6 characters
  - Confirm Password: required, must match password (custom validate function)
  - Role: select dropdown (Patient or Doctor)
- Success screen with link to login after registration
- Inline field-level error messages (red text)
- Loading spinner during submission

**API Endpoint**: `POST /api/auth/register`

**Form Fields**:

```typescript
{
  name: string; // required
  email: string; // required, email pattern
  password: string; // required, minLength: 6
  confirmPassword: string; // required, validate: matches password
  role: "PATIENT" | "DOCTOR";
}
```

**Password Matching Validation**:

```typescript
validate: (value) =>
  value === getValues("password") || "Passwords do not match";
```

---

### 3. Forgot Password Page (`/auth/forgot-password`)

**Location**: `src/app/auth/forgot-password/page.tsx`

**Features**:

- Single email field
- Built-in validation:
  - Email: required, valid email pattern
- Success screen after submission (always shown for security)
- Message: "If that email exists in our system, we've sent a reset link"
- Link back to login page
- Loading spinner during submission

**API Endpoint**: `POST /api/auth/forgot-password`

**Form Fields**:

```typescript
{
  email: string; // required, email pattern
}
```

**Security Note**: Always shows success message regardless of whether email exists (prevents email enumeration attacks).

---

### 4. Reset Password Page (`/auth/reset-password/[token]`)

**Location**: `src/app/auth/reset-password/[token]/page.tsx`

**Features**:

- New password and confirm password fields
- Built-in validation:
  - New Password: required, minimum 6 characters
  - Confirm Password: required, must match new password
- Token extracted from URL params
- Success screen with auto-redirect to login (2 seconds)
- Error message if token is invalid/expired
- Loading spinner during submission

**API Endpoint**: `POST /api/auth/reset-password`

**Form Fields**:

```typescript
{
  token: string; // from URL params
  newPassword: string; // required, minLength: 6
  confirmPassword: string; // required, validate: matches newPassword
}
```

---

## Common Features Across All Pages

### UI Components Used

- ✅ Card (container)
- ✅ Input (form fields)
- ✅ Label (field labels)
- ✅ Button (submit buttons)
- ✅ Alert (error messages)
- ✅ Select (role dropdown in register)
- ✅ Loader2 icon (loading spinner)
- ✅ CheckCircle2 icon (success screens)
- ✅ Mail icon (forgot password success)

### Layout

- Full-page centered layout
- Maximum width: `max-w-md` (448px)
- Responsive padding: `p-4`
- Background: `bg-background` (CSS variable)
- Dark mode compatible (uses CSS variables)

### Form Validation

- Uses React Hook Form's built-in validation rules
- No Zod or other schema validation libraries
- Validation rules:
  - `required`: Field is required
  - `minLength`: Minimum character length
  - `pattern`: Regex pattern matching
  - `validate`: Custom validation function

### Error Handling

- Field-level errors: Red text below input fields
- Form-level errors: Alert component below form
- API errors: Displayed in Alert component
- Loading states: Button disabled with spinner

### User Experience

- Loading spinners during API calls
- Success screens with clear messaging
- Automatic redirects after success
- Links between auth pages
- Accessible form labels
- Keyboard navigation support

---

## Validation Rules Reference

### Email Pattern

```typescript
pattern: {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: 'Invalid email address',
}
```

### Password Minimum Length

```typescript
minLength: {
  value: 6,
  message: 'Password must be at least 6 characters',
}
```

### Password Confirmation

```typescript
validate: (value) =>
  value === getValues("password") || "Passwords do not match";
```

---

## API Integration

All pages use the centralized Axios instance from `src/lib/api.ts`:

```typescript
import api from "@/lib/api";

// Example usage
const response = await api.post("/api/auth/login", data);
```

**Benefits**:

- Automatic cookie handling (`withCredentials: true`)
- 401 error interceptor (auto-redirect to login)
- Consistent base URL from environment variable

---

## Testing Checklist

### Login Page

- [ ] Valid credentials redirect to correct dashboard
- [ ] Invalid credentials show error message
- [ ] Empty fields show validation errors
- [ ] Invalid email format shows error
- [ ] Password less than 6 characters shows error
- [ ] Loading spinner appears during submission
- [ ] Links to register and forgot password work

### Register Page

- [ ] All required fields validated
- [ ] Email format validated
- [ ] Password minimum length validated
- [ ] Passwords must match
- [ ] Role selection works
- [ ] Success screen appears after registration
- [ ] Link to login works from success screen
- [ ] Loading spinner appears during submission

### Forgot Password Page

- [ ] Email format validated
- [ ] Success message always shown
- [ ] Link back to login works
- [ ] Loading spinner appears during submission

### Reset Password Page

- [ ] Token extracted from URL
- [ ] Password minimum length validated
- [ ] Passwords must match
- [ ] Success screen appears
- [ ] Auto-redirect to login after 2 seconds
- [ ] Invalid token shows error message
- [ ] Loading spinner appears during submission

---

## Dark Mode Support

All pages use CSS variables for colors, making them fully compatible with dark mode:

- `bg-background` - Page background
- `text-foreground` - Text color
- `text-muted-foreground` - Muted text
- `text-primary` - Primary color (links)
- `text-destructive` - Error messages
- `border` - Border colors

No hardcoded colors are used, ensuring seamless dark mode switching.

---

## Next Steps

1. **Backend Implementation**: Implement the corresponding API endpoints in the backend
2. **Email Service**: Set up Resend for password reset emails
3. **Testing**: Test all authentication flows end-to-end
4. **Dashboard Pages**: Create role-specific dashboard pages
5. **Protected Routes**: Ensure middleware properly protects dashboard routes
6. **Session Management**: Implement token refresh if needed
7. **Error Handling**: Add more specific error messages based on backend responses

---

## File Structure

```
src/app/auth/
├── login/
│   └── page.tsx              # Login page
├── register/
│   └── page.tsx              # Registration page
├── forgot-password/
│   └── page.tsx              # Forgot password page
└── reset-password/
    └── [token]/
        └── page.tsx          # Reset password page (dynamic route)
```

---

## Dependencies Used

- `react-hook-form` - Form state management and validation
- `next/navigation` - Router and navigation
- `@/lib/api` - Axios instance for API calls
- `@/components/ui/*` - Shadcn UI components
- `lucide-react` - Icons

---

## Notes

- All pages are client components (`'use client'`)
- Form submission is handled asynchronously
- Error states are managed with React state
- Success states show dedicated screens
- All forms are accessible and keyboard-navigable
- Loading states prevent double submissions
