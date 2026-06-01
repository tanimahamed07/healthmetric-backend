import { Router } from "express";
import * as vitalController from "../controllers/vital.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.use(authenticate);

router.post("/", authorize("PATIENT", "DOCTOR"), vitalController.createVital);
router.get("/", vitalController.getVitals);
router.get("/:id", vitalController.getVitalById);
router.put("/:id", authorize("PATIENT", "DOCTOR"), vitalController.updateVital);
router.delete(
  "/:id",
  authorize("PATIENT", "DOCTOR", "ADMIN"),
  vitalController.deleteVital,
);

export default router;
