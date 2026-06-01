# Database Migration Information

## Migration File: `src/config/migrate.ts`

This file creates all necessary database tables for the HealthMetric application.

### How to Run

```bash
npx ts-node src/config/migrate.ts
```

### Tables Created

#### 1. **users**

- Primary user accounts table
- Stores: name, email, password (hashed), role, image, email verification status
- Roles: ADMIN, DOCTOR, PATIENT
- Timestamps: created_at, updated_at

#### 2. **patients**

- Patient-specific information
- Links to users table via user_id (CASCADE DELETE)
- Stores: blood_group, age, gender, phone, emergency_contact, medical_history

#### 3. **doctors**

- Doctor profiles
- Links to users table via user_id (CASCADE DELETE)
- Stores: specialization, experience, qualifications, availability (JSONB)

#### 4. **appointments**

- Appointment bookings between patients and doctors
- Status: PENDING, APPROVED, COMPLETED, CANCELLED
- Stores: date, time_slot, status, notes

#### 5. **prescriptions**

- Medical prescriptions issued by doctors
- Medicines stored as JSONB for flexibility
- Links to both patients and doctors

#### 6. **reports**

- Medical reports with file storage
- Stores Cloudinary file URLs and public IDs
- Categorized by report_type

#### 7. **vitals**

- Patient vital signs tracking
- Stores: type (e.g., blood pressure, heart rate), value, unit
- Timestamped with recorded_at

#### 8. **subscriptions**

- Stripe subscription management
- Plans: FREE, PRO, PREMIUM
- Stores Stripe customer and subscription IDs

#### 9. **notifications**

- User notifications system
- Stores: title, message, read status
- Linked to users (CASCADE DELETE)

#### 10. **password_reset_tokens**

- Password reset functionality
- Stores: token, expiration timestamp
- Linked to users (CASCADE DELETE)

## Helper Functions

### `createNotification()`

Added to `src/config/db.ts`:

```typescript
export async function createNotification(
  userId: string,
  title: string,
  message: string,
);
```

**Usage:**

```typescript
import { createNotification } from "./config/db";

await createNotification(
  "user-uuid-here",
  "Appointment Confirmed",
  "Your appointment has been confirmed for tomorrow at 10 AM",
);
```

## Important Notes

1. **Run migration only once** - Tables use `CREATE TABLE IF NOT EXISTS`
2. **Requires DATABASE_URL** - Make sure your `.env` file has a valid NeonDB connection string
3. **Foreign Keys** - All relationships use CASCADE DELETE for data integrity
4. **UUID Primary Keys** - All tables use UUID with `gen_random_uuid()`
5. **Timestamps** - Most tables include automatic timestamp tracking

## Migration Output

When successful, you'll see:

```
🔄 Starting database migration...
✅ Users table created
✅ Patients table created
✅ Doctors table created
✅ Appointments table created
✅ Prescriptions table created
✅ Reports table created
✅ Vitals table created
✅ Subscriptions table created
✅ Notifications table created
✅ Password reset tokens table created
🎉 Database migration completed successfully!
```

## Troubleshooting

- **Connection Error**: Check your DATABASE_URL in `.env`
- **SSL Error**: NeonDB requires SSL - already configured in `db.ts`
- **Permission Error**: Ensure your database user has CREATE TABLE permissions
