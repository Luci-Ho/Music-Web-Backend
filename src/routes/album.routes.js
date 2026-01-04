import express from 'express';
import { getAllAlbums, getAlbumById, getSongsByAlbumId } from '../controllers/album.controller.js';

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.get('/:id/songs', getSongsByAlbumId);

export default router;
