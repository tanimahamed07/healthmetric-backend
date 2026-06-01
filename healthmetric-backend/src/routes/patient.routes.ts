import { Router } from "express";
import * as patientController from "../controllers/patient.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "DOCTOR"), patientController.getAllPatients);
router.get("/:id", patientController.getPatientById);
router.put(
  "/:id",
  authorize("PATIENT", "ADMIN"),
  patientController.updatePatient,
);
router.delete("/:id", authorize("ADMIN"), patientController.deletePatient);

export default router;
