import Client from "../models/Client.js";
import Deal from "../models/Deal.js";
import Invoice from "../models/Invoice.js";
import { crudFactory } from "../utils/crudFactory.js";

const clientBase = crudFactory(Client, { populate: ["owner"] });
export const listClients = clientBase.list;
export const getClient = clientBase.getOne;
export const createClient = clientBase.create;
export const updateClient = clientBase.update;

const dealBase = crudFactory(Deal, { populate: ["client", "owner"] });
export const listDeals = dealBase.list;
export const createDeal = dealBase.create;
export const updateDeal = dealBase.update;

const invoiceBase = crudFactory(Invoice, { populate: ["client", "deal"] });
export const listInvoices = invoiceBase.list;
export const createInvoice = invoiceBase.create;

export async function markInvoicePaid(req, res) {
  const inv = await Invoice.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true });
  if (!inv) return res.status(404).json({ message: "Not found" });
  res.json(inv);
}
