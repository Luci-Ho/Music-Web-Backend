import Mood from '../models/Mood.model.js';
import Song from '../models/Song.model.js';

export const getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find().sort({ title: 1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMoodById = async (req, res) => {
  try {
    const m = await Mood.findById(req.params.id);
    if (!m) return res.status(404).json({ message: 'Mood not found' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSongsByMood = async (req, res) => {
  try {
    const songs = await Song.find({ mood: req.params.id }).populate('artist album genre mood');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
