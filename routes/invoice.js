import express from 'express';
const router = express.Router();

import { getInvoice, getInvoiceAdmin, saveInvoiceAdminData, showAllInvoices, createInvoiceData } from '../controllers/invoice.js';

router.get("/invoice", getInvoice);

router.get("/invoice/admin", getInvoiceAdmin);

router.post("/invoice/admin", saveInvoiceAdminData);

router.get("/invoice/showall", showAllInvoices);

router.post("/invoice/create", createInvoiceData);

export default router;