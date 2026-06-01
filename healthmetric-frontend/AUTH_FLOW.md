# Authentication Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Landing    │
│     Page     │
│      /       │
└──────┬───────┘
       │
       ├─────────────────────────────────────────────┐
       │                                             │
       v                                             v
┌──────────────┐                            ┌──────────────┐
│    Login     │                            │   Register   │
│ /auth/login  │◄───────────────────────────│/auth/register│
└──────┬───────┘                            └──────┬───────┘
       │                                           │
       │ ┌─────────────────────────────────────────┘
       │ │
       │ │ Success
       │ │
       v v
┌──────────────────────────────────────────────────┐
│           Role-Based Redirect                    │
├──────────────────────────────────────────────────┤
│  PATIENT  → /dashboard/patient                   │
│  DOCTOR   → /dashboard/doctor                    │
│  ADMIN    → /dashboard/admin                     │
└──────────────────────────────────────────────────┘

┌──────────────┐
│    Login     │
│ /auth/login  │
└──────┬───────┘
       │
       │ Forgot Password?
       │
       v
┌──────────────┐
│   Forgot     │
│  Password    │
│/auth/forgot- │
│  password    │
└──────┬───────┘
       │
       │ Email Sent
       │
       v
┌──────────────┐
│  Check Email │
│   (Success)  │
└──────┬───────┘
       │
       │ Click Link in Email
       │
       v
┌──────────────┐
│    Reset     │
│  Password    │
│/auth/reset-  │
│password/     │
│  [token]     │
└──────┬───────┘
       │
       │ Success
       │
       v
┌──────────────┐
│    Login     │
│ /auth/login  │
└──────────────┘
```

## Page-by-Page Flow

### 1. Login Flow

```
User visits /auth/login
    │
    ├─► Enters email & password
    │
    ├─► Clicks "Sign In"
    │
    ├─► API: POST /api/auth/login
    │
    ├─► Success?
    │   │
    │   ├─► YES → Check user role
    │   │         │
    │   │         ├─► PATIENT → /dashboard/patient
    │   │         ├─► DOCTOR  → /dashboard/doctor
    │   │         └─► ADMIN   → /dashboard/admin
    │   │
    │   └─► NO → Show error message
    │             "Invalid email or password"
    │
    └─► Links available:
        ├─► "Forgot password?" → /auth/forgot-password
        └─► "Sign up" → /auth/register
```

### 2. Register Flow

```
User visits /auth/register
    │
    ├─► Fills form:
    │   ├─► Name
    │   ├─► Email
    │   ├─► Password
    │   ├─► Confirm Password
    │   └─► Role (Patient/Doctor)
    │
    ├─► Clicks "Create Account"
    │
    ├─► Validation:
    │   ├─► All fields required?
    │   ├─► Email valid format?
    │   ├─► Password >= 6 chars?
    │   └─► Passwords match?
    │
    ├─► API: POST /api/auth/register
    │
    ├─► Success?
    │   │
    │   ├─► YES → Show success screen
    │   │         "Registration Successful!"
    │   │         └─► Link to /auth/login
    │   │
    │   └─► NO → Show error message
    │             (e.g., "Email already exists")
    │
    └─► Link available:
        └─► "Sign in" → /auth/login
```

### 3. Forgot Password Flow

```
User visits /auth/forgot-password
    │
    ├─► Enters email address
    │
    ├─► Clicks "Send Reset Link"
    │
    ├─► API: POST /api/auth/forgot-password
    │
    ├─► Always show success screen
    │   (for security - no email enumeration)
    │   │
    │   └─► "Check Your Email"
    │       "If that email exists, we sent a link"
    │
    ├─► Backend sends email (if exists)
    │   with reset link:
    │   /auth/reset-password/[token]
    │
    └─► Link available:
        └─► "Back to Login" → /auth/login
```

### 4. Reset Password Flow

```
User clicks link in email
    │
    └─► /auth/reset-password/[token]
        │
        ├─► Enters new password
        ├─► Confirms new password
        │
        ├─► Clicks "Reset Password"
        │
        ├─► Validation:
        │   ├─► Password >= 6 chars?
        │   └─► Passwords match?
        │
        ├─► API: POST /api/auth/reset-password
        │   Body: { token, newPassword }
        │
        ├─► Success?
        │   │
        │   ├─► YES → Show success screen
        │   │         "Password Reset Successful!"
        │   │         Auto-redirect in 2 seconds
        │   │         └─► /auth/login
        │   │
        │   └─► NO → Show error message
        │             "Link expired or invalid"
        │
        └─► Link available:
            └─► "Back to login" → /auth/login
```

## Validation Rules Summary

### Login Page

| Field    | Rules                          |
| -------- | ------------------------------ |
| Email    | Required, Valid email format   |
| Password | Required, Minimum 6 characters |

### Register Page

| Field            | Rules                          |
| ---------------- | ------------------------------ |
| Name             | Required                       |
| Email            | Required, Valid email format   |
| Password         | Required, Minimum 6 characters |
| Confirm Password | Required, Must match password  |
| Role             | Required (Patient or Doctor)   |

### Forgot Password Page

| Field | Rules                        |
| ----- | ---------------------------- |
| Email | Required, Valid email format |

### Reset Password Page

| Field            | Rules                             |
| ---------------- | --------------------------------- |
| New Password     | Required, Minimum 6 characters    |
| Confirm Password | Required, Must match new password |

## API Endpoints Required

### Backend Must Implement:

1. **POST /api/auth/login**
   - Body: `{ email, password }`
   - Response: `{ id, name, email, role, image? }`
   - Sets httpOnly cookie with JWT token

2. **POST /api/auth/register**
   - Body: `{ name, email, password, role }`
   - Response: `{ message: "Registration successful" }`
   - Creates user and patient/doctor record

3. **POST /api/auth/forgot-password**
   - Body: `{ email }`
   - Response: `{ message: "Email sent if exists" }`
   - Generates reset token and sends email

4. **POST /api/auth/reset-password**
   - Body: `{ token, newPassword }`
   - Response: `{ message: "Password reset successful" }`
   - Validates token and updates password

5. **GET /api/auth/me**
   - Headers: Cookie with JWT token
   - Response: `{ id, name, email, role, image? }`
   - Used by middleware to check auth status

6. **POST /api/auth/logout**
   - Clears httpOnly cookie
   - Response: `{ message: "Logged out" }`

## Security Considerations

### Frontend

- ✅ Passwords never stored in state longer than needed
- ✅ No sensitive data in URL (except reset token)
- ✅ HTTPS required in production
- ✅ Automatic redirect on 401 errors
- ✅ No email enumeration (forgot password always succeeds)

### Backend (To Implement)

- ⚠️ Hash passwords with bcryptjs
- ⚠️ Use httpOnly cookies for JWT
- ⚠️ Set secure flag on cookies in production
- ⚠️ Implement rate limiting on auth endpoints
- ⚠️ Expire reset tokens after 1 hour
- ⚠️ Validate token before password reset
- ⚠️ Send email notifications on password changes

## Error Messages

### Login

- "Email is required"
- "Invalid email address"
- "Password is required"
- "Password must be at least 6 characters"
- "Invalid email or password. Please try again." (API error)

### Register

- "Name is required"
- "Email is required"
- "Invalid email address"
- "Password is required"
- "Password must be at least 6 characters"
- "Please confirm your password"
- "Passwords do not match"
- "Registration failed. Please try again." (API error)

### Forgot Password

- "Email is required"
- "Invalid email address"

### Reset Password

- "Password is required"
- "Password must be at least 6 characters"
- "Please confirm your password"
- "Passwords do not match"
- "Failed to reset password. The link may be expired." (API error)

## Success Messages

### Register

- "Registration Successful!"
- "Your account has been created successfully."

### Forgot Password

- "Check Your Email"
- "If that email exists in our system, we've sent a password reset link."

### Reset Password

- "Password Reset Successful!"
- "Your password has been reset successfully."

## Loading States

All forms show loading state during submission:

- Button disabled
- Spinner icon (Loader2)
- Text changes:
  - "Sign In" → "Signing in..."
  - "Create Account" → "Creating account..."
  - "Send Reset Link" → "Sending..."
  - "Reset Password" → "Resetting password..."

## Redirect Behavior

### After Login

- PATIENT → `/dashboard/patient`
- DOCTOR → `/dashboard/doctor`
- ADMIN → `/dashboard/admin`

### After Register

- Show success screen
- User clicks "Go to Login"
- Redirects to `/auth/login`

### After Reset Password

- Show success screen
- Auto-redirect after 2 seconds
- Redirects to `/auth/login`

### Middleware Protection

- Accessing `/dashboard/*` without token → `/auth/login`
- Accessing `/auth/*` with token → `/dashboard`
