import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.use(authenticate);

router.post("/", authorize("DOCTOR", "PATIENT"), reportController.createReport);
router.get("/", reportController.getReports);
router.get("/:id", reportController.getReportById);
router.put("/:id", authorize("DOCTOR"), reportController.updateReport);
router.delete(
  "/:id",
  authorize("DOCTOR", "ADMIN"),
  reportController.deleteReport,
);

export default router;
