import express from 'express';
import { getAllAlbums, 
    getAlbumById, 
    getSongsByAlbumId,
    createAlbum,
    updateAlbum,
    deleteAlbum
} from '../controllers/album.controller.js';

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.get('/:id/songs', getSongsByAlbumId);

router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
