import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favorite.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:songId', authenticate, addFavorite);
router.delete('/:songId', authenticate, removeFavorite);
router.get('/', authenticate, getFavorites);

export default router;
