import express from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import {
  listClients, getClient, createClient, updateClient,
  listDeals, createDeal, updateDeal,
  listInvoices, createInvoice, markInvoicePaid,
} from "../controllers/crmController.js";
const router = express.Router();
router.use(protect);
router.get("/clients", listClients);
router.get("/clients/:id", getClient);
router.post("/clients", allowRoles("Founder","Super Admin","Finance","Dept Head","Team Lead"), createClient);
router.patch("/clients/:id", allowRoles("Founder","Super Admin","Finance","Dept Head","Team Lead"), updateClient);
router.get("/deals", listDeals);
router.post("/deals", allowRoles("Founder","Super Admin","Finance","Dept Head","Team Lead"), createDeal);
router.patch("/deals/:id", allowRoles("Founder","Super Admin","Finance","Dept Head","Team Lead"), updateDeal);
router.get("/invoices", listInvoices);
router.post("/invoices", allowRoles("Founder","Super Admin","Finance"), createInvoice);
router.patch("/invoices/:id/pay", allowRoles("Founder","Super Admin","Finance"), markInvoicePaid);
export default router;
