import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { submit, todaySubmissions, pending, review } from "../controllers/socialController.js";
const router = express.Router();
router.use(protect);
router.post("/", submit);
router.get("/today", todaySubmissions);
router.get("/pending", allowRoles("Team Lead","Dept Head","HR","Founder","Super Admin"), pending);
router.patch("/:id/review", allowRoles("Team Lead","Dept Head","HR","Founder","Super Admin"), review);

// Screenshot proof upload. Returns {name, url}; frontend saves the url on
// the submission as `screenshotUrl` before posting the form.
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(201).json({
    name: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
  });
});

export default router;