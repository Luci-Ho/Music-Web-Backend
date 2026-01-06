import express from 'express';
import {
  getAllSongs,
  getFeaturedSongs,
  getSongById,
  getSongsByGenre,
  searchSongs,
  getTopSongs,
  getSongsByYear ,
  getSongsByArtist,
  getHomeSongs,
  getNewestSongs,
  createSong,
  updateSong,
  deleteSong,
} from '../controllers/song.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
//không thay đổi thứ tự route, tips: route cụ thể phải TRƯỚc route động
router.get('/', getAllSongs);

// protected create/update/delete
// router.post('/', authenticate, createSong);
// router.patch('/:id', authenticate, updateSong);
router.delete('/:id', authenticate, deleteSong);

// GET /api/songs/home
router.get('/home', getHomeSongs);
router.get('/new', getNewestSongs);

router.get('/artist/:artistId', getSongsByArtist);


router.get('/featured', getFeaturedSongs);
router.get('/top', getTopSongs);
router.get('/search', searchSongs);

router.get('/year/:year', getSongsByYear);
router.get('/genre/:genreId', getSongsByGenre);


router.get('/:id', getSongById); // 🚨 LUÔN ĐỂ CUỐI


export default router;
