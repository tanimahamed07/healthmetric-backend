# Testing Authentication Pages

## Quick Start Testing Guide

### Prerequisites

1. Backend server running on `http://localhost:5000`
2. Frontend server running on `http://localhost:3000`
3. Database migrated with all tables created

### Test URLs

- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Forgot Password: http://localhost:3000/auth/forgot-password
- Reset Password: http://localhost:3000/auth/reset-password/[token]

---

## Manual Testing Checklist

### 1. Login Page Testing

#### Valid Login Test

```
1. Navigate to http://localhost:3000/auth/login
2. Enter valid credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"
4. Expected: Redirect to role-specific dashboard
   - Patient → /dashboard/patient
   - Doctor → /dashboard/doctor
   - Admin → /dashboard/admin
```

#### Invalid Login Tests

```
Test Case 1: Empty Fields
1. Leave email and password empty
2. Click "Sign In"
3. Expected: Show "Email is required" and "Password is required"

Test Case 2: Invalid Email Format
1. Enter: notanemail
2. Enter password: password123
3. Click "Sign In"
4. Expected: Show "Invalid email address"

Test Case 3: Short Password
1. Enter email: test@example.com
2. Enter password: 12345 (only 5 chars)
3. Click "Sign In"
4. Expected: Show "Password must be at least 6 characters"

Test Case 4: Wrong Credentials
1. Enter email: wrong@example.com
2. Enter password: wrongpassword
3. Click "Sign In"
4. Expected: Show "Invalid email or password. Please try again."
```

#### Navigation Tests

```
Test Case 1: Forgot Password Link
1. Click "Forgot your password?"
2. Expected: Navigate to /auth/forgot-password

Test Case 2: Register Link
1. Click "Sign up"
2. Expected: Navigate to /auth/register
```

---

### 2. Register Page Testing

#### Valid Registration Test

```
1. Navigate to http://localhost:3000/auth/register
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
   - Role: Patient
3. Click "Create Account"
4. Expected: Show success screen with "Registration Successful!"
5. Click "Go to Login"
6. Expected: Navigate to /auth/login
```

#### Invalid Registration Tests

```
Test Case 1: Empty Fields
1. Leave all fields empty
2. Click "Create Account"
3. Expected: Show validation errors for all required fields

Test Case 2: Invalid Email
1. Enter name: John Doe
2. Enter email: notanemail
3. Enter password: password123
4. Enter confirm: password123
5. Click "Create Account"
6. Expected: Show "Invalid email address"

Test Case 3: Short Password
1. Fill all fields correctly
2. Enter password: 12345 (only 5 chars)
3. Click "Create Account"
4. Expected: Show "Password must be at least 6 characters"

Test Case 4: Password Mismatch
1. Fill all fields correctly
2. Enter password: password123
3. Enter confirm: password456
4. Click "Create Account"
5. Expected: Show "Passwords do not match"

Test Case 5: Duplicate Email
1. Register with email: test@example.com
2. Try to register again with same email
3. Expected: Show error from backend (e.g., "Email already exists")
```

#### Role Selection Test

```
1. Click role dropdown
2. Expected: See "Patient" and "Doctor" options
3. Select "Doctor"
4. Expected: Role field updates to "Doctor"
```

#### Navigation Tests

```
Test Case 1: Login Link
1. Click "Sign in"
2. Expected: Navigate to /auth/login
```

---

### 3. Forgot Password Page Testing

#### Valid Email Test

```
1. Navigate to http://localhost:3000/auth/forgot-password
2. Enter email: test@example.com
3. Click "Send Reset Link"
4. Expected: Show success screen
   "Check Your Email"
   "If that email exists in our system, we've sent a reset link"
5. Click "Back to Login"
6. Expected: Navigate to /auth/login
```

#### Invalid Email Tests

```
Test Case 1: Empty Email
1. Leave email field empty
2. Click "Send Reset Link"
3. Expected: Show "Email is required"

Test Case 2: Invalid Email Format
1. Enter: notanemail
2. Click "Send Reset Link"
3. Expected: Show "Invalid email address"

Test Case 3: Non-existent Email
1. Enter: nonexistent@example.com
2. Click "Send Reset Link"
3. Expected: Still show success screen (security feature)
```

#### Navigation Tests

```
Test Case 1: Back to Login Link
1. Click "Back to login"
2. Expected: Navigate to /auth/login
```

---

### 4. Reset Password Page Testing

#### Valid Reset Test

```
1. Get reset token from email or database
2. Navigate to http://localhost:3000/auth/reset-password/[token]
3. Enter new password: newpassword123
4. Enter confirm: newpassword123
5. Click "Reset Password"
6. Expected: Show success screen
   "Password Reset Successful!"
7. Wait 2 seconds or click "Go to Login"
8. Expected: Navigate to /auth/login
9. Try logging in with new password
10. Expected: Login successful
```

#### Invalid Reset Tests

```
Test Case 1: Empty Fields
1. Leave both fields empty
2. Click "Reset Password"
3. Expected: Show validation errors

Test Case 2: Short Password
1. Enter new password: 12345 (only 5 chars)
2. Click "Reset Password"
3. Expected: Show "Password must be at least 6 characters"

Test Case 3: Password Mismatch
1. Enter new password: password123
2. Enter confirm: password456
3. Click "Reset Password"
4. Expected: Show "Passwords do not match"

Test Case 4: Invalid Token
1. Navigate to /auth/reset-password/invalid-token
2. Enter valid passwords
3. Click "Reset Password"
4. Expected: Show error "Failed to reset password. The link may be expired."

Test Case 5: Expired Token
1. Use a token that's older than 1 hour
2. Enter valid passwords
3. Click "Reset Password"
4. Expected: Show error about expired link
```

#### Navigation Tests

```
Test Case 1: Back to Login Link
1. Click "Back to login"
2. Expected: Navigate to /auth/login
```

---

## Loading State Testing

### All Pages Should Show Loading State

```
1. Fill form with valid data
2. Click submit button
3. Expected during submission:
   - Button disabled
   - Spinner icon visible
   - Button text changes:
     * "Sign In" → "Signing in..."
     * "Create Account" → "Creating account..."
     * "Send Reset Link" → "Sending..."
     * "Reset Password" → "Resetting password..."
4. After response:
   - Button enabled again
   - Spinner disappears
   - Original text restored (if error)
```

---

## Dark Mode Testing

### Test Dark Mode Compatibility

```
1. Enable dark mode in your browser/OS
2. Visit each auth page
3. Expected:
   - Background color changes appropriately
   - Text remains readable
   - Form fields have proper contrast
   - Buttons are visible
   - Error messages are readable
   - No hardcoded colors visible
```

---

## Responsive Design Testing

### Mobile Testing (< 768px)

```
1. Resize browser to mobile width (375px)
2. Visit each auth page
3. Expected:
   - Card fits within viewport
   - No horizontal scrolling
   - Form fields are full width
   - Buttons are full width
   - Text is readable
   - Touch targets are adequate (44px minimum)
```

### Tablet Testing (768px - 1024px)

```
1. Resize browser to tablet width (768px)
2. Visit each auth page
3. Expected:
   - Card remains centered
   - Max width maintained (448px)
   - Layout looks balanced
```

### Desktop Testing (> 1024px)

```
1. View on desktop resolution (1920px)
2. Visit each auth page
3. Expected:
   - Card centered on screen
   - Max width maintained (448px)
   - Plenty of whitespace around card
```

---

## Accessibility Testing

### Keyboard Navigation

```
1. Use Tab key to navigate through form
2. Expected:
   - Focus moves through all fields in order
   - Focus indicator visible on each field
   - Can submit form with Enter key
   - Can navigate links with Tab + Enter

Tab Order:
Login: Email → Password → Submit → Forgot Link → Register Link
Register: Name → Email → Password → Confirm → Role → Submit → Login Link
Forgot: Email → Submit → Back Link
Reset: New Password → Confirm → Submit → Back Link
```

### Screen Reader Testing

```
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate through form
3. Expected:
   - Labels read correctly
   - Error messages announced
   - Button states announced (disabled/enabled)
   - Success messages announced
```

### Focus Management

```
1. Submit form with errors
2. Expected:
   - Focus remains on form
   - Error messages visible
   - Can correct errors and resubmit

1. Submit form successfully
2. Expected:
   - Focus moves to success screen
   - Can navigate to next action
```

---

## Error Handling Testing

### Network Error Test

```
1. Stop backend server
2. Try to submit any form
3. Expected:
   - Show error message
   - Button re-enabled
   - User can retry
```

### Timeout Test

```
1. Add artificial delay to backend
2. Submit form
3. Expected:
   - Loading state shows
   - Eventually shows error or success
   - No infinite loading
```

### CORS Error Test

```
1. Change FRONTEND_URL in backend .env
2. Try to submit form
3. Expected:
   - CORS error in console
   - Show generic error message to user
```

---

## Security Testing

### XSS Prevention

```
1. Try entering script tags in form fields:
   <script>alert('XSS')</script>
2. Submit form
3. Expected:
   - Script not executed
   - Treated as plain text
```

### SQL Injection Prevention

```
1. Try entering SQL in form fields:
   ' OR '1'='1
2. Submit form
3. Expected:
   - Treated as plain text
   - No database errors
   - Backend uses parameterized queries
```

### Email Enumeration Prevention

```
1. Go to forgot password page
2. Enter non-existent email
3. Expected:
   - Same success message as valid email
   - No indication whether email exists
```

---

## Integration Testing

### Full Registration → Login Flow

```
1. Register new account
2. See success screen
3. Click "Go to Login"
4. Login with new credentials
5. Expected: Redirect to dashboard
```

### Full Password Reset Flow

```
1. Go to login page
2. Click "Forgot password?"
3. Enter email
4. Check email for reset link
5. Click reset link
6. Enter new password
7. See success screen
8. Auto-redirect to login
9. Login with new password
10. Expected: Login successful
```

### Middleware Protection Test

```
1. Logout (or clear cookies)
2. Try to access /dashboard/patient directly
3. Expected: Redirect to /auth/login

1. Login successfully
2. Try to access /auth/login directly
3. Expected: Redirect to /dashboard
```

---

## Performance Testing

### Page Load Time

```
1. Open DevTools Network tab
2. Navigate to each auth page
3. Expected:
   - Page loads in < 1 second
   - No unnecessary requests
   - Assets cached properly
```

### Form Submission Time

```
1. Fill form with valid data
2. Click submit
3. Measure time to response
4. Expected:
   - Response in < 2 seconds
   - Loading state visible
   - No UI freezing
```

---

## Browser Compatibility Testing

### Test in Multiple Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Expected in All Browsers

- Forms work correctly
- Validation displays properly
- Styling consistent
- No console errors
- Redirects work
- Cookies set correctly

---

## Automated Testing Script

### Using cURL to Test API Endpoints

```bash
# Test Registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "PATIENT"
  }'

# Test Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test Get Current User
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt

# Test Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## Common Issues and Solutions

### Issue: Form doesn't submit

**Solution**: Check browser console for errors, verify backend is running

### Issue: Validation not working

**Solution**: Check React Hook Form registration, verify validation rules

### Issue: Redirect not working

**Solution**: Check Next.js router, verify role-based redirect logic

### Issue: Cookies not set

**Solution**: Check backend CORS settings, verify withCredentials: true

### Issue: Dark mode colors wrong

**Solution**: Verify using CSS variables, not hardcoded colors

### Issue: Mobile layout broken

**Solution**: Check responsive classes, verify max-w-md and p-4

---

## Test Data

### Valid Test Users

```json
{
  "patient": {
    "email": "patient@test.com",
    "password": "password123",
    "role": "PATIENT"
  },
  "doctor": {
    "email": "doctor@test.com",
    "password": "password123",
    "role": "DOCTOR"
  },
  "admin": {
    "email": "admin@test.com",
    "password": "password123",
    "role": "ADMIN"
  }
}
```

### Invalid Test Data

```json
{
  "invalidEmail": "notanemail",
  "shortPassword": "12345",
  "emptyString": "",
  "sqlInjection": "' OR '1'='1",
  "xssAttempt": "<script>alert('XSS')</script>"
}
```

---

## Success Criteria

All authentication pages are working correctly when:

- ✅ All validation rules work as expected
- ✅ API calls succeed with valid data
- ✅ Error messages display correctly
- ✅ Loading states show during submission
- ✅ Success screens appear after completion
- ✅ Redirects work based on user role
- ✅ Dark mode works properly
- ✅ Responsive on all screen sizes
- ✅ Keyboard navigation works
- ✅ No console errors
- ✅ Cookies set correctly
- ✅ Middleware protects routes
