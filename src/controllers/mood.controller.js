import Mood from '../models/Mood.model.js';
import Song from '../models/Song.model.js';

export const getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find().sort({ title: 1 }).lean();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMoodById = async (req, res) => {
  try {
    const m = await Mood.findById(req.params._id).lean();
    if (!m) return res.status(404).json({ message: 'Mood not found' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSongsByMood = async (req, res) => {
  try {
    const songs = await Song.find({ moodId: req.params._id })
      .populate('artistId', 'name')
      .populate('albumId', 'title')
      .populate('genreId', 'title')
      .populate('moodId', 'title')
      .lean();

    res.json(songs);
  } catch (err) {
    console.error('getSongsByMood error:', err);
    res.status(500).json({ message: err.message });
  }
};

