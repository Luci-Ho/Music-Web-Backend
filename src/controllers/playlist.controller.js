import Playlist from '../models/Playlist.model.js';
import Song from '../models/Song.model.js';
import User from '../models/User.model.js';

export const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic, coverImage } = req.body;
   

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Tên playlist không được để trống' });
    }

    // ✅ check trùng tên playlist của cùng user
    const existed = await Playlist.findOne({
      ownerId: req.user.id,
      name: name.trim()
    });

    if (existed) {
      return res.status(400).json({
        message: 'Playlist này đã tồn tại trong tài khoản của bạn'
      });
    }

    const playlist = await Playlist.create({
      playlistId: `pl-${Date.now()}`,
      name: name.trim(),
      description: description || '',
      isPublic: !!isPublic,
      coverImage: coverImage || null,
      ownerId: req.user.id,
      songs: [],
    });

    // ✅ THÊM PLAYLIST VÀO USER
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { playlists: playlist._id } } // tránh trùng
    );

    res.status(201).json(
      playlist.toObject({ depopulate: true })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate({
        path: 'songs',
        select: 'title duration coverUrl views artistId genreId',
      })
      .populate('ownerId', 'username avatar')
      .lean(); // ⭐ QUAN TRỌNG

    if (!playlist)
      return res.status(404).json({ message: 'Playlist not found' });

    res.json(playlist);
  } catch (err) {
    console.error('getPlaylist error:', err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/playlists/me
export const getUserPlaylists = async (req, res) => {
  console.log('REQ.USER:', req.user);

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    const playlists = await Playlist.find({
      ownerId: req.user._id
    }).populate('songs', 'title duration coverUrl')
    .lean();

    res.json(playlists);

  } catch (err) {
    console.error('getUserPlaylists error:', err);
    res.status(500).json({ message: err.message });
  }
};



export const updatePlaylist = async (req, res) => {
  try {
    const p = await Playlist.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });
    if (p.ownerId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const allowedFields = ['name', 'description', 'isPublic', 'coverImage'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        p[field] = req.body[field];
      }
    });


    await p.save();

    res.json(p.toObject({ depopulate: true }));

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const p = await Playlist.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });

    if (p.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // 1️⃣ Xoá playlist khỏi user
    await User.findByIdAndUpdate(p.ownerId, {
      $pull: { playlists: p._id }
    });

    // 2️⃣ Xoá playlist
    await Playlist.findByIdAndDelete(p._id);

    res.json({ message: 'Deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const p = await Playlist.findById(id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });

    if (p.ownerId.toString() !== req.user.id.toString())
      return res.status(403).json({ message: 'Forbidden' });

    if (!p.songs.map(s => s.toString()).includes(songId)) {
      p.songs.push(songId);
      await p.save();
    }

    // ⭐ POPULATE TRƯỚC KHI TRẢ
    const populated = await Playlist.findById(id)
      .populate('songs', 'title duration coverUrl');

    res.json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;

    const p = await Playlist.findById(id);
    if (!p) return res.status(404).json({ message: 'Playlist not found' });

    if (p.ownerId.toString() !== req.user.id.toString())
      return res.status(403).json({ message: 'Forbidden' });

    p.songs = p.songs.filter(s => s.toString() !== songId);
    await p.save();

    const populated = await Playlist.findById(id)
      .populate('songs', 'title duration coverUrl');

    res.json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


