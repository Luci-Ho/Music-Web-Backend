import Artist from '../models/Artist.model.js';
import Song from '../models/Song.model.js';

// Lấy tất cả artist
export const getAllArtists = async (req, res) => {
  try {
    // dùng lean() để trả về plain object, tránh vòng lặp khi stringify
    const artists = await Artist.find().sort({ name: 1 }).lean();
    res.json(artists);
  } catch (err) {
    console.error("GET ALL ARTISTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết artist theo id
export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params._id).lean();
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
  } catch (err) {
    console.error("GET ARTIST BY ID ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách bài hát theo artistId
export const getSongsByArtistId = async (req, res) => {
  try {
    const songs = await Song.find({ artistId: req.params._id })
      .populate("artistId", "name img")
      .populate("albumId", "title img")
      .populate("genreId", "title img")
      .populate("moodId", "title img")
      .lean(); // thêm lean để tránh vòng lặp

    res.json(songs);
  } catch (err) {
    console.error("GET SONGS BY ARTIST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};