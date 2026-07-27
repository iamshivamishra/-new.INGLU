import PerformanceReview from "../models/PerformanceReview.js";
import { crudFactory } from "../utils/crudFactory.js";

const base = crudFactory(PerformanceReview, { populate: ["user", "reviewedBy"] });
export const listReviews = base.list;
export const createReview = base.create;
export const updateReview = base.update;

export async function history(req, res) {
  const reviews = await PerformanceReview.find({ user: req.params.userId }).sort({ createdAt: -1 });
  res.json(reviews);
}
