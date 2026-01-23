import Genre from '../models/Genre.model.js';
import Song from '../models/Song.model.js';

export const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ title: 1 }).lean();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGenreById = async (req, res) => {
  try {
    const g = await Genre.findById(req.params._id).lean();

    if (!g) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.json(g);
  } catch (err) {
    console.error('getGenreById error:', err);
    res.status(500).json({ message: err.message });
  }
};


export const getSongsByGenre = async (req, res) => {
  try {
    const songs = await Song.find({ genreId: req.params._id })
      .populate('artistId', 'name')
      .populate('albumId', 'title')
      .populate('genreId', 'title')
      .populate('moodId', 'title')
      .lean();

    res.json(songs);
  } catch (err) {
    console.error('getSongsByGenre error:', err);
    res.status(500).json({ message: err.message });
  }
};

