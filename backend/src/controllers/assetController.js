import Asset from "../models/Asset.js";
import { crudFactory } from "../utils/crudFactory.js";

const base = crudFactory(Asset, { populate: ["assignedTo"] });
export const listAssets = base.list;
export const createAsset = base.create;

export async function issueAsset(req, res) {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Not found" });
  asset.assignedTo = req.body.userId;
  asset.status = "Issued";
  asset.issuedOn = new Date();
  asset.history.push({ action: "Issued", by: req.user.name, notes: req.body.notes });
  await asset.save();
  res.json(asset);
}

export async function returnAsset(req, res) {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Not found" });
  asset.assignedTo = null;
  asset.status = "Returned";
  asset.history.push({ action: "Returned", by: req.user.name, notes: req.body.notes });
  await asset.save();
  res.json(asset);
}
