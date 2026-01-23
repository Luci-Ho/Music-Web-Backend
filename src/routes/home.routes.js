import express from 'express';
import { getHomeData } from '../controllers/home.controller.js';
import { authenticateOptional } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateOptional, getHomeData);

export default router;
