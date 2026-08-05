import express from "express";
import { protect } from "../middleware/auth.js";
import {
  listTasks,
  createTask,
  getTask,
  updateTaskStatus,
  removeTask,
  addComment,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.get("/", listTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", removeTask);
router.post("/:id/comments", addComment);

export default router;