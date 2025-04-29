import express from 'express';
const router = express.Router();

import { getAPIKey, getUserData } from '../controllers/user.js';

router.get("/", getAPIKey);

router.get("/user", getUserData);

export default router;