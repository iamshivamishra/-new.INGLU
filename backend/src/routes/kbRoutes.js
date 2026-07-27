import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { listArticles, createArticle, search } from "../controllers/kbController.js";
const router = express.Router();
router.use(protect);
router.get("/", listArticles);
router.get("/search", search);
router.post("/", allowRoles("Founder","Super Admin","HR"), createArticle);
export default router;
