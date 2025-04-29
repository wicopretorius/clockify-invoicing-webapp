import express from 'express';
const router = express.Router();

import { postSetCookie } from '../controllers/cookie.js';

router.post("/cookie", postSetCookie);

export default router;