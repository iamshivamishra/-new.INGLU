import mongoose from "mongoose";
const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  entity: String,
  entityId: String,
  diff: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
export default mongoose.model("AuditLog", auditLogSchema);
