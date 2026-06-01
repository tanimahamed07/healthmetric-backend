import { Router } from "express";
import * as subscriptionController from "../controllers/subscription.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import express from "express";

const router = Router();

// Webhook route (no auth, raw body)
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  subscriptionController.handleWebhook,
);

// Authenticated routes
router.use(authenticate);

router.get("/", subscriptionController.getSubscription);
router.post(
  "/stripe/checkout",
  authorize("PATIENT"),
  subscriptionController.createCheckoutSession,
);
router.post(
  "/stripe/portal",
  authorize("PATIENT"),
  subscriptionController.createPortalSession,
);

export default router;
