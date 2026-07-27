import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
}, { timestamps: true });
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  priority: { type: String, enum: ["Low","Medium","High"], default: "Medium" },
  status: { type: String, enum: ["To Do","In Progress","In Review","Done"], default: "To Do" },
  dueDate: Date,
  department: String,
  comments: [commentSchema],
  approvalRequired: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model("Task", taskSchema);
