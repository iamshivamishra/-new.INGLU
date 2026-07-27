import KBArticle from "../models/KBArticle.js";
import { crudFactory } from "../utils/crudFactory.js";

const base = crudFactory(KBArticle);
export const listArticles = base.list;
export const createArticle = base.create;

export async function search(req, res) {
  const q = req.query.q || "";
  const results = await KBArticle.find({ title: { $regex: q, $options: "i" } });
  res.json(results);
}
