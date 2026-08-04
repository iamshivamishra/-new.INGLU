import Task from "../models/Task.js";
import { crudFactory } from "../utils/crudFactory.js";

const base = crudFactory(Task, { populate: ["assignee", "createdBy"] });
export const listTasks = base.list;
export const getTask = base.getOne;
export const removeTask = base.remove;

// Always set createdBy from the authenticated user server-side — the
// generic crudFactory.create() just does Model.create(req.body), and the
// client never sends createdBy, so every task's createdBy was silently
// staying empty. That, in turn, was hiding self-created tasks from a
// user's own Daily Report task picker when they weren't formally assigned.
export async function createTask(req, res) {
  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  await task.populate(["assignee", "createdBy"]);
  res.status(201).json(task);
}

export async function updateTaskStatus(req, res) {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
}

export async function addComment(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Not found" });
  task.comments.push({ author: req.user._id, text: req.body.text });
  await task.save();
  res.json(task);
}