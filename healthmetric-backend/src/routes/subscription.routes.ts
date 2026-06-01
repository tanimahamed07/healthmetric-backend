import { Router } from "express";
import * as subscriptionController from "../controllers/subscription.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.use(authenticate);

router.post(
  "/create",
  authorize("PATIENT"),
  subscriptionController.createSubscription,
);
router.get("/", subscriptionController.getSubscriptions);
router.get("/:id", subscriptionController.getSubscriptionById);
router.post(
  "/cancel",
  authorize("PATIENT"),
  subscriptionController.cancelSubscription,
);
router.post("/webhook", subscriptionController.handleWebhook);

export default router;
