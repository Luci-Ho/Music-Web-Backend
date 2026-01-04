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
} from '../controllers/song.controller.js';

const router = express.Router();
//không thay đổi thứ tự route, tips: route cụ thể phải TRƯỚc route động
router.get('/', getAllSongs);

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
