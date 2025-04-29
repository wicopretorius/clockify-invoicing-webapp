import express from 'express';
const router = express.Router();

import { getReport, getReportData, saveReportData, showAllReports } from '../controllers/report.js';

router.get("/report", getReport);

router.get("/report/create", getReportData);

router.post("/report/create", saveReportData);

router.get("/report/showall", showAllReports);

export default router;