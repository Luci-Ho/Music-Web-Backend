import mongoose from 'mongoose';
import Song from '../models/Song.model.js';
import Artist from '../models/Artist.model.js';
import Genre from '../models/Genre.model.js';

/**
 * GET /api/songs
 * Lấy toàn bộ bài hát
 */
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }).populate('artist album genre mood');
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
};

/**
 * GET /api/songs/featured
 * Lấy bài hát nổi bật
 */
export const getFeaturedSongs = async (req, res) => {
  try {
    const songs = await Song.find({ isFeatured: true }).limit(10);
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured songs' });
  }
};

/**
 * GET /api/songs/:id
 * Lấy chi tiết 1 bài hát
 */
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('artist album genre mood');

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // tăng view
    song.viewCount = (song.viewCount || 0) + 1;
    await song.save();

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch song' });
  }
};

/**
 * GET /api/songs/genre/:genre
 * Lấy bài hát theo thể loại
 */
export const getSongsByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    let genreId = genre;
    if (!mongoose.Types.ObjectId.isValid(genre)) {
      const g = await Genre.findOne({ title: { $regex: genre, $options: 'i' } });
      genreId = g ? g._id : null;
    }
    const query = genreId ? { genre: genreId } : { 'genre.title': { $regex: genre, $options: 'i' } };
    const songs = await Song.find(query).populate('artist album genre mood');

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch songs by genre' });
  }
};

/**
 * GET /api/songs/search?q=
 * Tìm kiếm theo title / artist
 */
export const searchSongs = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(200).json([]);

    // search by title or artist name
    const artists = await Artist.find({ name: { $regex: q, $options: 'i' } });
    const artistIds = artists.map(a => a._id);

    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $in: artistIds } },
      ],
    }).populate('artist album genre mood');

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};

/**
 * GET /api/songs/top
 * Top bài hát nhiều view nhất
 */
export const getTopSongs = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const songs = await Song.find()
      .sort({ viewCount: -1 })
      .limit(limit)
      .populate('artist album genre mood');

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top songs' });
  }
};

/**
 * GET /api/songs/year/:year
 * Lấy bài hát theo năm phát hành
 */
export const getSongsByYear = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const songs = await Song.find({
      releaseDate: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate('artist album genre mood');

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch songs by year' });
  }
};

export const getSongsByArtist = async (req, res) => {
  try {
    const artist = req.params.artist;
    let artistId = artist;
    if (!mongoose.Types.ObjectId.isValid(artist)) {
      const a = await Artist.findOne({ name: { $regex: artist, $options: 'i' } });
      artistId = a ? a._id : null;
    }

    if (!artistId) return res.status(200).json([]);

    const songs = await Song.find({ artist: artistId }).populate('artist album genre mood');

    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch artist songs' });
  }
};

export const getNewestSongs = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const songs = await Song.find()
      .sort({ releaseDate: -1 })
      .limit(limit)
      .populate('artist album genre mood');

    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch newest songs' });
  }
};


export const getHomeSongs = async (req, res) => {
  try {
    const [newest, featured, top] = await Promise.all([
      Song.find().sort({ releaseDate: -1 }).limit(5).populate('artist album genre mood'),
      Song.find({ isFeatured: true }).limit(5).populate('artist album genre mood'),
      Song.find().sort({ viewCount: -1 }).limit(5).populate('artist album genre mood'),
    ]);

    res.json({ newest, featured, top });
  } catch {
    res.status(500).json({ message: 'Failed to load home data' });
  }
};

/**
 * POST /api/songs
 * Tạo mới bài hát
 */
export const createSong = async (req, res) => {
  try {
    const payload = req.body;
    // allow media upload handled elsewhere; accept artist/album as ids
    const song = new Song(payload);
    if (req.user) song.createdBy = req.user._id;
    await song.save();
    const populated = await Song.findById(song._id).populate('artist album genre mood');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PATCH /api/songs/:id
 * Cập nhật bài hát
 */
export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // optional: only creator or admin can update
    if (req.user && song.createdBy && song.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(song, updates);
    await song.save();
    const populated = await Song.findById(song._id).populate('artist album genre mood');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/songs/:id
 */
export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    if (req.user && song.createdBy && song.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await song.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

