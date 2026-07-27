import Lead from "../models/Lead.js";
import { crudFactory } from "../utils/crudFactory.js";

const base = crudFactory(Lead, { populate: ["owner"] });
export const listLeads = base.list;
export const getLead = base.getOne;
export const createLead = base.create;

export async function assignLead(req, res) {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });
  lead.owner = req.body.ownerId;
  lead.status = "Contacted";
  lead.timeline.push({ label: `Assigned to ${req.body.ownerName || "rep"}` });
  await lead.save();
  res.json(lead);
}

export async function logActivity(req, res) {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });
  lead.timeline.push({ label: req.body.label });
  if (req.body.nextFollowUp) lead.nextFollowUp = req.body.nextFollowUp;
  await lead.save();
  res.json(lead);
}
