import express from 'express';
import { getAllGenres, getGenreById, getSongsByGenre } from '../controllers/genre.controller.js';

const router = express.Router();

router.get('/', getAllGenres);
router.get('/:_id', getGenreById);
router.get('/:_id/songs', getSongsByGenre);

export default router;
