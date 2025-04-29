import express from 'express';
const router = express.Router();

import { getWorkspaceData } from '../controllers/workspace.js';
router.get("/workspace", getWorkspaceData);

export default router;