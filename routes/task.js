import express from 'express';
const router = express.Router();

import { getTaskData, checkTaskData } from '../controllers/task.js';;

router.get("/task", getTaskData);

router.get("/task/check", checkTaskData); // Endpoint to check task readiness

export default router;