import express from 'express';
import {
  createPlaylist,
  getPlaylist,
  getUserPlaylists,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from '../controllers/playlist.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, createPlaylist);
router.get('/me', authenticate, getUserPlaylists);
router.get('/:id', getPlaylist);
router.patch('/:id', authenticate, updatePlaylist);
router.delete('/:id', authenticate, deletePlaylist);
router.post('/:id/songs', authenticate, addSongToPlaylist);
router.delete('/:id/songs', authenticate, removeSongFromPlaylist);

export default router;
