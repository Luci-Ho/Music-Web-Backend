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
import validate from '../middlewares/validate.js';
import { createPlaylistSchema, updatePlaylistSchema } from '../validation/playlist.schema.js';

const router = express.Router();

router.post('/', authenticate, validate(createPlaylistSchema), createPlaylist);
router.get('/me', authenticate, getUserPlaylists);
router.get('/:id', getPlaylist);
router.patch('/:id', authenticate, validate(updatePlaylistSchema), updatePlaylist);
router.delete('/:id', authenticate, deletePlaylist);
router.post('/:id/songs', authenticate, addSongToPlaylist);
router.delete('/:id/songs', authenticate, removeSongFromPlaylist);

export default router;
