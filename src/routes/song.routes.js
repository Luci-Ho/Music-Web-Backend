import express from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getSongById,
  getSongsByGenre,
  searchSongs,
  getTopSongs,
  getSongsByYear,
  getSongsByArtist,
  getHomeSongs,
  getNewestSongs,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/song.controller.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllSongs);
router.get("/home", getHomeSongs);
router.get("/new", getNewestSongs);
router.get("/artist/:artistId", getSongsByArtist);
router.get("/featured", getFeaturedSongs);
router.get("/top", getTopSongs);
router.get("/search", searchSongs);
router.get("/year/:year", getSongsByYear);
router.get("/genre/:genreId", getSongsByGenre);

// ✅ ADMIN (bật lại)
router.post("/", authenticate, createSong);
router.patch("/:_id", authenticate, updateSong);
router.delete("/:_id", authenticate, deleteSong);

// ✅ GET BY ID (luôn để cuối)
router.get("/:_id", getSongById);

export default router;
