import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { listAnnouncements, createAnnouncement } from "../controllers/announcementController.js";
const router = express.Router();
router.use(protect);
router.get("/", listAnnouncements);
router.post("/", allowRoles("Founder","Super Admin","HR","Dept Head"), createAnnouncement);
export default router;
