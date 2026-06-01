# TypeScript Build Fixes Needed

## Issue: userId can be undefined

All controller functions that use `req.user?.userId` need to add a validation check before using it in SQL queries.

## Pattern to Apply

**Before:**

```typescript
export const someFunction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const [result] = await sql`
      SELECT * FROM table WHERE user_id = ${userId}
    `;
```

**After:**

```typescript
export const someFunction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [result] = await sql`
      SELECT * FROM table WHERE user_id = ${userId}
    `;
```

## Files That Need This Fix

1. `src/controllers/appointment.controller.ts` - 3 functions
2. `src/controllers/prescription.controller.ts` - 3 functions
3. `src/controllers/report.controller.ts` - 4 functions
4. `src/controllers/vital.controller.ts` - 2 functions
5. `src/controllers/doctor.controller.ts` - 1 function
6. ✅ `src/controllers/notification.controller.ts` - FIXED
7. ✅ `src/controllers/subscription.controller.ts` - FIXED

## Quick Fix Command

Run this sed command to add the validation automatically:

```bash
# This adds the userId validation after "const userId = req.user?.userId;"
find src/controllers -name "*.ts" -exec sed -i '' '/const userId = req.user?.userId;/a\
\
    if (!userId) {\
      return res.status(401).json({ message: "Unauthorized" });\
    }
' {} \;
```

## Alternative: Use Middleware

Add `validateUserId` middleware to routes that require it:

```typescript
import { validateUserId } from "../middleware/validateUser";

router.get("/", authenticate, validateUserId, controller.getItems);
```

This way you don't need to add the check in every controller function.
