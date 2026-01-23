import express from 'express';
import { getAllArtists, getArtistById, getSongsByArtistId } from '../controllers/artist.controller.js';

const router = express.Router();

router.get('/', getAllArtists);
router.get('/:_id', getArtistById);
router.get('/:_id/songs', getSongsByArtistId);

export default router;
