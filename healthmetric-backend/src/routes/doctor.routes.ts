import { Router } from "express";
import * as doctorController from "../controllers/doctor.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);

router.use(authenticate);
router.put("/:id", authorize("DOCTOR", "ADMIN"), doctorController.updateDoctor);
router.delete("/:id", authorize("ADMIN"), doctorController.deleteDoctor);

export default router;
