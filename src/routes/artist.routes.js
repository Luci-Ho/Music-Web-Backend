import express from 'express';
import { getAllArtists, getArtistById, getSongsByArtistId } from '../controllers/artist.controller.js';

const router = express.Router();

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.get('/:id/songs', getSongsByArtistId);

export default router;
