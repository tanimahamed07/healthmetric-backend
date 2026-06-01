# HealthMetric Backend Deployment Guide

## Prerequisites

- Node.js 18+ installed
- NeonDB PostgreSQL database
- Cloudinary account
- Stripe account
- Resend account (for emails)

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=your_neondb_connection_string

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# Server
PORT=5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_PREMIUM=price_xxxxx

# Resend
RESEND_API_KEY=re_xxxxx
```

## Deployment Steps

### 1. Railway Deployment

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add all environment variables in the Railway dashboard
4. Add a `Procfile` in the root:
   ```
   web: node dist/server.js
   ```
5. Railway will automatically:
   - Run `npm install`
   - Run `npm run build`
   - Start the server with the Procfile command

### 2. Render Deployment

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
4. Add all environment variables in the Render dashboard

### 3. Database Migration

After deployment, run the migration:

```bash
npx ts-node src/config/migrate.ts
```

Or if using the deployed environment:

```bash
node dist/config/migrate.js
```

### 4. Seed Database (Optional)

Run the seed script to create initial data:

```bash
npx ts-node src/config/seed.ts
```

This creates:

- 1 Admin user
- 2 Doctor users
- 3 Patient users
- Subscriptions for all users (FREE by default)

## Stripe Setup

### 1. Create Products and Prices

1. Go to Stripe Dashboard → Products
2. Create two products:
   - **PRO Plan** - $9.99/month
   - **PREMIUM Plan** - $19.99/month
3. Copy the price IDs and add them to your `.env`:
   ```
   STRIPE_PRICE_PRO=price_xxxxx
   STRIPE_PRICE_PREMIUM=price_xxxxx
   ```

### 2. Configure Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend-domain.com/api/subscriptions/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy the webhook secret and add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## Health Check

After deployment, verify the API is running:

```bash
curl https://your-backend-domain.com/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "HealthMetric API is running"
}
```

## API Endpoints

Base URL: `https://your-backend-domain.com/api`

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Appointments

- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `PATCH /appointments/:id` - Update appointment
- `GET /appointments/slots` - Get available slots

### Prescriptions

- `GET /prescriptions` - List prescriptions
- `POST /prescriptions` - Create prescription
- `GET /prescriptions/:id` - Get prescription details

### Reports

- `GET /reports` - List reports
- `POST /reports` - Create report
- `DELETE /reports/:id` - Delete report

### Subscriptions

- `GET /subscription` - Get current subscription
- `POST /stripe/checkout` - Create checkout session
- `POST /stripe/portal` - Create billing portal session

### Vitals

- `GET /vitals` - List vitals
- `POST /vitals` - Create vital

### Notifications

- `GET /notifications` - List notifications
- `PATCH /notifications/read-all` - Mark all as read

### Admin

- `GET /admin/dashboard` - Dashboard stats
- `GET /admin/users` - List users (paginated)
- `PATCH /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

## Monitoring

### Logs

**Railway**: View logs in the Railway dashboard
**Render**: View logs in the Render dashboard

### Database

Monitor your NeonDB database:

- Connection count
- Query performance
- Storage usage

### Stripe

Monitor subscriptions in Stripe Dashboard:

- Active subscriptions
- Failed payments
- Webhook delivery

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check NeonDB is not paused
- Ensure SSL is enabled

### Stripe Webhook Issues

- Verify webhook secret is correct
- Check webhook endpoint is accessible
- Review webhook logs in Stripe Dashboard

### CORS Issues

- Verify `FRONTEND_URL` matches your frontend domain
- Ensure credentials are enabled in CORS config

## Security Checklist

- [ ] All environment variables are set
- [ ] JWT_SECRET is strong and random
- [ ] Database uses SSL
- [ ] Stripe webhook secret is configured
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (if implemented)
- [ ] Passwords are hashed with bcryptjs
- [ ] httpOnly cookies are used for JWT

## Performance Optimization

- Enable database connection pooling
- Add caching for frequently accessed data
- Optimize database queries with indexes
- Use CDN for static assets
- Enable gzip compression

## Backup Strategy

- NeonDB automatic backups (check your plan)
- Export database regularly
- Store backups in secure location
- Test restore procedures

## Scaling

### Horizontal Scaling

- Deploy multiple instances
- Use load balancer
- Share session state (Redis)

### Vertical Scaling

- Increase server resources
- Upgrade database plan
- Optimize queries

## Support

For issues or questions:

- Check logs first
- Review error messages
- Consult documentation
- Contact support if needed
