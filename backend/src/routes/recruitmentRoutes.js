import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import {
  listCandidates, getCandidate, createCandidate, removeCandidate,
  updateCandidateStage, addEvaluation, scheduleInterview, createOffer, sendOffer, pipeline,
} from "../controllers/recruitmentController.js";
const router = express.Router();
router.use(protect);
router.get("/pipeline", pipeline);
router.get("/candidates", listCandidates);
router.get("/candidates/:id", getCandidate);
router.post("/candidates", allowRoles("Founder","Super Admin","HR"), createCandidate);
router.patch("/candidates/:id/stage", allowRoles("Founder","Super Admin","HR","Dept Head"), updateCandidateStage);
router.post("/candidates/:id/evaluation", allowRoles("Founder","Super Admin","HR","Dept Head","Team Lead"), addEvaluation);
router.delete("/candidates/:id", allowRoles("Founder","Super Admin","HR"), removeCandidate);
router.post("/interviews", allowRoles("Founder","Super Admin","HR","Dept Head"), scheduleInterview);
router.post("/offers", allowRoles("Founder","Super Admin","HR"), createOffer);
router.post("/offers/:id/send", allowRoles("Founder","Super Admin","HR"), sendOffer);
export default router;
