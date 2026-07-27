import Announcement from "../models/Announcement.js";
import { crudFactory } from "../utils/crudFactory.js";

const base = crudFactory(Announcement, { populate: ["postedBy"] });
export const listAnnouncements = base.list;
export async function createAnnouncement(req, res) {
  const a = await Announcement.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(a);
}
