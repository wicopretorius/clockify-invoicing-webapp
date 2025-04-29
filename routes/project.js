import express from 'express';
const router = express.Router();

import { getProjectData } from '../controllers/project.js';

router.get("/project", getProjectData);

export default router;