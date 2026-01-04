import User from '../models/User.model.js';
import Song from '../models/Song.model.js';

export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { songId } = req.params;
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const idx = user.favorites.findIndex(f => f.toString() === songId);
    let action;
    if (idx === -1) {
      user.favorites.push(song._id);
      action = 'added';
    } else {
      user.favorites.splice(idx, 1);
      action = 'removed';
    }
    await user.save();
    res.json({ action, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { songId } = req.params;
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    if (!user.favorites.find(f => f.toString() === songId)) {
      user.favorites.push(song._id);
      await user.save();
    }
    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { songId } = req.params;
    user.favorites = user.favorites.filter(f => f.toString() !== songId);
    await user.save();
    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
