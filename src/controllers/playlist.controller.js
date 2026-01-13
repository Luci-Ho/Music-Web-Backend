import Playlist from '../models/Playlist.model.js';
import Song from '../models/Song.model.js';

export const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic, coverImage } = req.body;
    const playlist = await Playlist.create({
      playlistId: `pl-${Date.now()}`,
      name,
      description,
      isPublic: !!isPublic,
      coverImage: coverImage || null,
      ownerId: req.user._id,
      songs: [],
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params._id).populate('songs ownerId');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ ownerId: req.user._id }).populate('songs');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const p = await Playlist.findById(req.params._id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });
    if (p.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    Object.assign(p, req.body);
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const p = await Playlist.findById(req.params._id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });
    if (p.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await p.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params; // playlist id
    const { songId } = req.body;
    const p = await Playlist.findById(id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });
    if (p.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    if (!p.songs.includes(song._id)) p.songs.push(song._id);
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { id } = req.params; // playlist id
    const { songId } = req.body;
    const p = await Playlist.findById(id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });
    if (p.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    p.songs = p.songs.filter(s => s.toString() !== songId);
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
