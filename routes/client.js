import express from 'express';
const router = express.Router();

import { getClientData } from '../controllers/client.js';

router.get("/client", getClientData);

export default router;