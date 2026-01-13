import Album from '../models/Album.model.js';
import Song from '../models/Song.model.js';

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate('artist').sort({ title: 1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const a = await Album.findById(req.params._id).populate('artist songs');
    if (!a) return res.status(404).json({ message: 'Album not found' });
    res.json(a);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSongsByAlbumId = async (req, res) => {
  try {
    const songs = await Song.find({ album: req.params._id }).populate('artist album genre mood');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
