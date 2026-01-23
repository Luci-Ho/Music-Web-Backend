import express from 'express';
import { getFavorites, toggleFavorite  } from '../controllers/favorite.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:songId', authenticate, toggleFavorite);
router.get('/', authenticate, getFavorites);

export default router;
