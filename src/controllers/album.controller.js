import Album from '../models/Album.model.js';
import Song from '../models/Song.model.js';

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find()
      .populate({
        path: 'artistId',
        select: 'name img',
        options: { strictPopulate: false }, // 🔥 tránh crash khi artist thiếu
      })
      .sort({ title: 1 })
      .lean(); // 👉 trả object thuần, tránh lỗi stack

    // 🔥 lọc album bị thiếu artist (do data migrate cũ)
    const safeAlbums = albums.map(album => ({
      ...album,
      artistId: album.artistId || null,
    }));

    res.json(safeAlbums);
  } catch (err) {
    console.error('getAllAlbums error:', err);
    res.status(500).json({
      message: 'Get albums failed',
      error: err.message,
    });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artistId', 'name img')
      .lean(); // ✅ rất quan trọng

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const songs = await Song.find({ albumId: album._id })
      .populate('artistId', 'name')
      .lean(); // ✅ tránh mongoose object lồng nhau

    res.json({
      ...album,
      songs,
    });
  } catch (err) {
    console.error('getAlbumById error:', err);
    res.status(500).json({ message: err.message });
  }
};


export const getSongsByAlbumId = async (req, res) => {
  try {
    const albumId = req.params.id;

    const songs = await Song.find({ albumId })
      .populate('artistId', 'name img')
      .populate('genreId', 'name')
      .populate('moodId', 'name')
      .lean(); // ✅ CỰC KỲ QUAN TRỌNG

    res.json(songs);
  } catch (err) {
    console.error('getSongsByAlbumId error:', err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * POST /api/albums
 * Tạo album mới
 */
export const createAlbum = async (req, res) => {
  try {
    const album = new Album({
      legacyId: req.body.legacyId,
      title: req.body.title,
      artistId: req.body.artistId,
      songs: req.body.songs || [],
      img: req.body.img,
    });

    const savedAlbum = await album.save();
    res.status(201).json(savedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/albums/:id
 * Cập nhật album
 */
export const updateAlbum = async (req, res) => {
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      {
        legacyId: req.body.legacyId,
        title: req.body.title,
        artistId: req.body.artistId,
        songs: req.body.songs,
        img: req.body.img,
      },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json(updatedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /api/albums/:id
 * Xóa album
 */
export const deleteAlbum = async (req, res) => {
  try {
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id);

    if (!deletedAlbum) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchAlbums = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    // Nếu không nhập gì thì trả mảng rỗng (tránh quét full DB)
    if (!q) {
      return res.json([]);
    }

    const albums = await Album.find({
      title: { $regex: q, $options: 'i' },
    })
      .populate('artistId', 'name img')
      .lean(); // ✅ quan trọng

    res.json(albums);
  } catch (err) {
    console.error('searchAlbums error:', err);
    res.status(500).json({ message: err.message });
  }
};

