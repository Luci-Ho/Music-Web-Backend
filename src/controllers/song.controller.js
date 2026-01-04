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
    const { q, artistId, genreId, limit = 20, page = 1, sort } = req.query;
    const filter = { isActive: true };

    if (q) {
      filter.title = { $regex: q, $options: 'i' };
    }

    if (artistId && mongoose.Types.ObjectId.isValid(artistId)) {
      filter.artistId = artistId;
    }

    if (genreId && mongoose.Types.ObjectId.isValid(genreId)) {
      filter.genreId = genreId;
    }

    const perPage = Math.min(100, Number(limit));
    const skip = (Math.max(1, Number(page)) - 1) * perPage;

    let query = Song.find(filter)
      .populate('artistId', '_id legacyId')
      .populate('albumId', '_id legacyId')
      .populate('genreId', '_id legacyId')
      .populate('moodId', '_id legacyId');

    if (sort === 'views') query = query.sort({ viewCount: -1 });
    else if (sort === 'newest') query = query.sort({ releaseDate: -1 });
    else query = query.sort({ createdAt: -1 });

    const total = await Song.countDocuments(filter);
    const data = await query.skip(skip).limit(perPage).lean();

    // Rút gọn thủ công để chắc chắn chỉ còn _id + legacyId
    const simplified = data.map(song => ({
      ...song,
      artistId: song.artistId && {
        _id: song.artistId._id,
        legacyId: song.artistId.legacyId,
      },
      albumId: song.albumId && {
        _id: song.albumId._id,
        legacyId: song.albumId.legacyId,
      },
      genreId: song.genreId && {
        _id: song.genreId._id,
        legacyId: song.genreId.legacyId,
      },
      moodId: song.moodId && {
        _id: song.moodId._id,
        legacyId: song.moodId.legacyId,
      },
    }));

    res.json({ meta: { total, page: Number(page), perPage }, data: simplified });
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
    const { id } = req.params;

    // kiểm tra id có phải ObjectId hợp lệ không
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const song = isObjectId
      ? await Song.findById(id)
        .populate('artistId', '_id legacyId')
        .populate('albumId', '_id legacyId')
        .populate('genreId', '_id legacyId')
        .populate('moodId', '_id legacyId')
      : await Song.findOne({ legacyId: id })
        .populate('artistId', '_id legacyId')
        .populate('albumId', '_id legacyId')
        .populate('genreId', '_id legacyId')
        .populate('moodId', '_id legacyId');

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
 * query theo _id
 */
export const getSongsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    if (!mongoose.Types.ObjectId.isValid(genre)) {
      return res.status(400).json({ message: 'Invalid genre id' });
    }
    const songs = await Song.find({ genreId: genre });

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
        { artistId: { $in: artistIds } },
      ],
    }).populate('artistId', '_id legacyId');


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

    const songs = await Song.find({ isActive: true })
      .sort({ viewCount: -1 })
      .limit(limit)
      .populate('artistId', '_id legacyId')
      .populate('albumId', '_id legacyId')


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

    const songs = await Song.find({
      releaseDate: { $gte: start, $lt: end },
      isActive: true,
    })
      .populate('artistId', '_id legacyId')
      .populate('albumId', '_id legacyId')


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
    const songs = await Song.find({ artistId: { $in: artistIds } });


    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch artist songs' });
  }
};


export const getNewestSongs = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const songs = await Song.find({ isActive: true })
      .sort({ releaseDate: -1 })
      .limit(limit)
      .populate('artistId', '_id legacyId')
      .populate('albumId', '_id legacyId')


    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch newest songs' });
  }
};



export const getHomeSongs = async (req, res) => {
  try {
    const [newest, featured, top] = await Promise.all([
      Song.find({ isActive: true })
        .sort({ releaseDate: -1 })
        .limit(5),

      Song.find({ isFeatured: true, isActive: true })
        .limit(5),

      Song.find({ isActive: true })
        .sort({ viewCount: -1 })
        .limit(5),
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
    const populated = await Song.findById(song._id)
      .populate('artistId', '_id legacyId')
      .populate('albumId', '_id legacyId')
      .populate('genreId', '_id legacyId')
      .populate('moodId', '_id legacyId');

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

