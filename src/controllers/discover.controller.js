import Song from "../models/Song.model.js";
import Artist from "../models/Artist.model.js";
import Album from "../models/Album.model.js";
import Genre from "../models/Genre.model.js";
import Mood from "../models/Mood.model.js";

export const discover = async (req, res) => {
  try {
    // 1. Genres
    const genres = await Genre.find().lean();

    // 2. Moods
    const moods = await Mood.find().lean();

    // 3. Artists (phổ biến nhất)
    const artists = await Artist.find()
      .sort({ popularity: -1 })
      .limit(10)
      .lean();

    // 4. Albums (mới nhất)
    const albums = await Album.find()
      .sort({ releaseDate: -1 })
      .limit(10)
      .lean();

    // 5. Songs list (toàn bộ hoặc giới hạn)
    const songsList = await Song.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("artistId", "name")
      .populate("albumId", "title")
      .populate("genreId", "name")
      .populate("moodId", "name")
      .lean();

    // 6. Music Videos (thực chất lấy từ Song.media.videoUrl)
    const musicVideos = await Song.find({
      isActive: true,
      "media.videoUrl": { $exists: true, $ne: "" },
    })
      .sort({ viewCount: -1 })
      .limit(10)
      .populate("artistId", "name")
      .lean();

    return res.status(200).json({
      genres,
      moods,
      artists,
      albums,
      songsList,
      musicVideos,
    });
  } catch (error) {
    console.error("DISCOVER CONTROLLER ERROR:", error);
    return res.status(500).json({ message: "Failed to load discover data" });
  }
};
