import Genre from '../models/Genre.model.js';
import Song from '../models/Song.model.js';

export const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ title: 1 });
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGenreById = async (req, res) => {
  try {
    const g = await Genre.findById(req.params.id);
    if (!g) return res.status(404).json({ message: 'Genre not found' });
    res.json(g);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSongsByGenre = async (req, res) => {
  try {
    const songs = await Song.find({ genre: req.params.id }).populate('artist album genre mood');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
