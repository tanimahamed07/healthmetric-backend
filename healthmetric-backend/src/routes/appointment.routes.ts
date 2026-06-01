import { Router } from "express";
import * as appointmentController from "../controllers/appointment.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.use(authenticate);

router.get("/", appointmentController.getAppointments);
router.post("/", authorize("PATIENT"), appointmentController.createAppointment);
router.patch("/:id", appointmentController.updateAppointment);
router.get("/slots", appointmentController.getAvailableSlots);

export default router;
