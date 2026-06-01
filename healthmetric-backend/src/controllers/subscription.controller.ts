import { Request, Response } from "express";
import { AuthRequest } from "../types";
import sql, { createNotification } from "../config/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const getSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [subscription] = await sql`
      SELECT * FROM subscriptions WHERE user_id = ${userId}
    `;

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(subscription);
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
};

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    const { plan } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!plan || !["PRO", "PREMIUM"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    // Get or create subscription record
    let [subscription] = await sql`
      SELECT * FROM subscriptions WHERE user_id = ${userId}
    `;

    if (!subscription) {
      [subscription] = await sql`
        INSERT INTO subscriptions (user_id, plan, status)
        VALUES (${userId}, 'FREE', 'active')
        RETURNING *
      `;
    }

    // Create or get Stripe customer
    let customerId = subscription.stripe_customer_id;

    if (!customerId) {
      const [user] = await sql`
        SELECT email, name FROM users WHERE id = ${userId}
      `;

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId },
      });

      customerId = customer.id;

      await sql`
        UPDATE subscriptions 
        SET stripe_customer_id = ${customerId}
        WHERE user_id = ${userId}
      `;
    }

    // Get price ID from environment
    const priceId =
      plan === "PRO"
        ? process.env.STRIPE_PRICE_PRO
        : process.env.STRIPE_PRICE_PREMIUM;

    if (!priceId) {
      return res.status(500).json({ message: "Stripe price not configured" });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard/patient/subscription?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/patient/subscription`,
      metadata: {
        userId,
        plan,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({ message: "No signature" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res
      .status(400)
      .json({ message: "Webhook signature verification failed" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await sql`
            UPDATE subscriptions
            SET plan = ${plan},
                stripe_subscription_id = ${session.subscription as string},
                status = 'active',
                expires_at = NULL
            WHERE user_id = ${userId}
          `;

          await createNotification(
            userId,
            "Subscription Activated",
            `Your ${plan} subscription has been activated successfully`,
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const [dbSubscription] = await sql`
          SELECT user_id FROM subscriptions 
          WHERE stripe_customer_id = ${customerId}
        `;

        if (dbSubscription) {
          await sql`
            UPDATE subscriptions
            SET plan = 'FREE',
                status = 'cancelled',
                stripe_subscription_id = NULL
            WHERE user_id = ${dbSubscription.user_id}
          `;

          await createNotification(
            dbSubscription.user_id,
            "Subscription Cancelled",
            "Your subscription has been cancelled. You now have a FREE plan.",
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const [dbSubscription] = await sql`
          SELECT user_id FROM subscriptions 
          WHERE stripe_customer_id = ${customerId}
        `;

        if (dbSubscription) {
          const status =
            subscription.status === "active" ? "active" : "cancelled";

          await sql`
            UPDATE subscriptions
            SET status = ${status}
            WHERE user_id = ${dbSubscription.user_id}
          `;
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ message: "Webhook handler failed" });
  }
};

export const createPortalSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [subscription] = await sql`
      SELECT stripe_customer_id FROM subscriptions WHERE user_id = ${userId}
    `;

    if (!subscription || !subscription.stripe_customer_id) {
      return res.status(404).json({ message: "No Stripe customer found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard/patient/subscription`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Create portal session error:", error);
    res.status(500).json({ message: "Failed to create portal session" });
  }
};

export const getSubscriptions = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get subscriptions endpoint - to be implemented" });
};

export const getSubscriptionById = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Get subscription by ID endpoint - to be implemented" });
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  res
    .status(501)
    .json({ message: "Cancel subscription endpoint - to be implemented" });
};
