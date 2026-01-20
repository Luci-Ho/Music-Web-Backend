import Song from '../models/Song.model.js';

/**
 * 📌 GET /api/videos
 * Lấy danh sách bài hát có video
 */
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Song.find({
      'media.videoUrl': { $exists: true, $ne: '' }
    })
      .populate('artistId', 'name img')
      .sort({ createdAt: -1 })
      .lean();

    res.json(videos);
  } catch (err) {
    console.error('getAllVideos error:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách video' });
  }
};

/**
 * 📌 GET /api/videos/:id
 * Lấy chi tiết 1 video (thực chất là 1 song)
 */
export const getVideoById = async (req, res) => {
  try {
    const video = await Song.findById(req.params.id)
      .populate('artistId', 'name img')
      .populate('albumId', 'title img')
      .lean();

    if (!video || !video.media?.videoUrl) {
      return res.status(404).json({ message: 'Video không tồn tại' });
    }

    res.json(video);
  } catch (err) {
    console.error('getVideoById error:', err);
    res.status(500).json({ message: 'Lỗi lấy video' });
  }
};
