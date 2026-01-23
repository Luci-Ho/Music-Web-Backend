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
router.get('/:_id', getPlaylist);
router.patch('/:_id', authenticate, updatePlaylist);
router.delete('/:_id', authenticate, deletePlaylist);
router.post('/:_id/songs', authenticate, addSongToPlaylist);
router.delete('/:_id/songs', authenticate, removeSongFromPlaylist);

export default router;
