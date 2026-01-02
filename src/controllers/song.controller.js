import Song from '../models/Song.js';

/**
 * GET /api/songs
 * Lấy toàn bộ bài hát
 */
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
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
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // tăng view
    song.viewCount += 1;
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
    const songs = await Song.find({ genre });

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

    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
      ],
    });

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
      .limit(limit);

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
      release_date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch songs by year' });
  }
};

export const getSongsByArtist = async (req, res) => {
  try {
    const artist = req.params.artist;
    const songs = await Song.find({
      artist: { $regex: artist, $options: 'i' },
    });

    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch artist songs' });
  }
};

export const getNewestSongs = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const songs = await Song.find()
      .sort({ release_date: -1 })
      .limit(limit);

    res.json(songs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch newest songs' });
  }
};


export const getHomeSongs = async (req, res) => {
  try {
    const [newest, featured, top] = await Promise.all([
      Song.find().sort({ release_date: -1 }).limit(5),
      Song.find({ isFeatured: true }).limit(5),
      Song.find().sort({ viewCount: -1 }).limit(5),
    ]);

    res.json({ newest, featured, top });
  } catch {
    res.status(500).json({ message: 'Failed to load home data' });
  }
};

