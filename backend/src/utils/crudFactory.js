// Generic CRUD controller factory to keep module controllers concise.
export function crudFactory(Model, opts = {}) {
  const { populate = [] } = opts;

  return {
    async list(req, res) {
      const filter = { ...req.query };
      delete filter.page; delete filter.limit;
      let query = Model.find(filter).sort({ createdAt: -1 });
      populate.forEach((p) => (query = query.populate(p)));
      const docs = await query;
      res.json(docs);
    },
    async getOne(req, res) {
      let query = Model.findById(req.params.id);
      populate.forEach((p) => (query = query.populate(p)));
      const doc = await query;
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    },
    async create(req, res) {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    },
    async update(req, res) {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    },
    async remove(req, res) {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted" });
    },
  };
}
