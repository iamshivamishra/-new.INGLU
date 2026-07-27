import express from "express";
import {
  login, me, setFirstTimePassword, signup,
  sendOtp, verifyOtp, forgotPassword, resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", protect, me);
router.post("/first-time-setup", protect, setFirstTimePassword);

router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);

router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);

export default router;
