import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.use(authenticate);

router.get("/", reportController.getReports);
router.post("/", authorize("PATIENT"), reportController.createReport);
router.delete("/:id", authorize("PATIENT"), reportController.deleteReport);
router.get(
  "/patient/:patientId",
  authorize("DOCTOR"),
  reportController.getReportsByPatient,
);

export default router;
