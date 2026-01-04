import Artist from '../models/Artist.model.js';
import Song from '../models/Song.model.js';

export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ name: 1 });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const a = await Artist.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Artist not found' });
    res.json(a);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSongsByArtistId = async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.params.id }).populate('artist album genre mood');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
