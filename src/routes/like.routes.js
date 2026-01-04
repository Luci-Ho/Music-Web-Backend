import express from 'express';
import { toggleFavorite, getFavorites } from '../controllers/favorite.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:songId', authenticate, toggleFavorite);
router.get('/', authenticate, getFavorites);

export default router;
