import { Router } from "express";
import * as prescriptionController from "../controllers/prescription.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("DOCTOR"),
  prescriptionController.createPrescription,
);
router.get("/", prescriptionController.getPrescriptions);
router.get("/:id", prescriptionController.getPrescriptionById);
router.put(
  "/:id",
  authorize("DOCTOR"),
  prescriptionController.updatePrescription,
);
router.delete(
  "/:id",
  authorize("DOCTOR", "ADMIN"),
  prescriptionController.deletePrescription,
);

export default router;
