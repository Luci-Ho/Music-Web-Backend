import express from 'express';
import { getAllAlbums, getAlbumById, getSongsByAlbumId } from '../controllers/album.controller.js';

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:_id', getAlbumById);
router.get('/:_id/songs', getSongsByAlbumId);

export default router;
