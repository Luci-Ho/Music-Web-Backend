import mongoose from 'mongoose';
import Song from '../models/Song.model.js';
import Artist from '../models/Artist.model.js';
import Genre from '../models/Genre.model.js';
import { populateSong } from '../utils/populateSong.js';

import { removeVietnameseTones } from '../utils/removeVietnameseTones.js';

/**
 * GET /api/songs
 * Lấy toàn bộ bài hát
 */
export const getAllSongs = async (req, res) => {
  try {
    const {
      q,
      artistId,
      genreId,
      page = 1,
      limit = 20,
      sort = 'newest',
    } = req.query;

    const filter = { isActive: true };

    if (q) filter.title = { $regex: q, $options: 'i' };
    if (mongoose.Types.ObjectId.isValid(artistId)) filter.artistId = artistId;
    if (mongoose.Types.ObjectId.isValid(genreId)) filter.genreId = genreId;

    const perPage = Math.min(100, Number(limit));
    const skip = (page - 1) * perPage;

    const sortMap = {
      views: { viewCount: -1 },
      newest: { createdAt: -1 },
    };

    const query = Song.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(perPage);

    const [total, data] = await Promise.all([
      Song.countDocuments(filter),
      populateSong(query).lean(),
    ]);

    res.json({
      meta: { total, page: Number(page), perPage },
      data,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
};

/**
 * GET /api/songs/featured
 * Lấy bài hát nổi bật
 */
export const getFeaturedSongs = async (req, res) => {
  try {
    const songs = await populateSong(
      Song.find({ isFeatured: true, isActive: true }).limit(10)
    );
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
    const { id } = req.params;

    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { legacyId: id };

    const song = await Song
      .findOneAndUpdate(
        filter,
        { $inc: { viewCount: 1 } },
        { new: true }
      )
      .populate('artistId', 'name image')
      .populate('albumId', 'title image artistId')
      .populate('genreId', 'title')
      .populate('moodId', 'title')
      .lean(); // ✅ chỉ lấy plain object

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.json(song);
  } catch (err) {
    console.error('❌ getSongById error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/songs/genre/:genre
 * Lấy bài hát theo thể loại
 * query theo _id
 */
export const getSongsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    if (!mongoose.Types.ObjectId.isValid(genre)) {
      return res.status(400).json({ message: 'Invalid genre id' });
    }
    const songs = await populateSong(
      Song.find({ genreId: genre, isActive: true })
    );

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
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const keyword = removeVietnameseTones(q);

    // 1️⃣ Tìm artist phù hợp (có dấu + không dấu)
    const artists = await Artist.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { nameNoAccent: { $regex: keyword, $options: 'i' } },
      ],
    }).select('_id');

    const artistIds = artists.map(a => a._id);

    // 2️⃣ Tìm bài hát
    const songs = await Song.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { titleNoAccent: { $regex: keyword, $options: 'i' } },
        { artistId: { $in: artistIds } },
      ],
    })
      .populate('artistId', 'name')
      .limit(30)
      .lean();

    res.json(songs);
  } catch (err) {
    console.error('❌ Search failed:', err);
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

    const songs = await populateSong(
      Song.find({ isActive: true })
        .sort({ viewCount: -1 })
        .limit(limit)
    );

    res.json(songs);
  } catch {
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

    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const songs = await populateSong(
      Song.find({
        releaseDate: { $gte: start, $lt: end },
        isActive: true,
      })
    );


    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch songs by year' });
  }
};


export const getSongsByArtist = async (req, res) => {
  try {
    const { artist } = req.params;
    const artists = await Artist.find({ name: { $regex: artist, $options: 'i' } });
    const artistIds = artists.map(a => a._id);
    const songs = await populateSong(
      Song.find({
        artistId: { $in: artistIds },
        isActive: true
      })
    );

    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch artist songs' });
  }
};


export const getNewestSongs = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const songs = await populateSong(
      Song.find({ isActive: true })
        .sort({ releaseDate: -1 })
        .limit(limit)
    );

    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch newest songs' });
  }
};

export const getHomeSongs = async (req, res) => {
  try {
    const [newest, featured, top] = await Promise.all([
      populateSong(
        Song.find({ isActive: true })
          .sort({ releaseDate: -1 })
          .limit(5)
      ),

      populateSong(
        Song.find({ isFeatured: true, isActive: true }).limit(5)
      ),

      populateSong(
        Song.find({ isActive: true })
          .sort({ viewCount: -1 })
          .limit(5)
      ),
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
const validateRefs = (body) => {
  const refs = ['artistId', 'albumId', 'genreId', 'moodId'];
  for (const key of refs) {
    if (body[key] && !mongoose.Types.ObjectId.isValid(body[key])) {
      throw new Error(`Invalid ${key}`);
    }
  }
};

export const createSong = async (req, res) => {
  try {
    validateRefs(req.body);

    const song = await Song.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    const populated = await populateSong(Song.findById(song._id));
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    const populated = await Song.findById(song._id)
      .populate('artistId', '_id legacyId')
      .populate('albumId', '_id legacyId')
      .populate('genreId', '_id legacyId')
      .populate('moodId', '_id legacyId');


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


