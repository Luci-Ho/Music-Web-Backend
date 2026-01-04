import Video from '../models/Video.model.js';

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const v = await Video.findById(req.params.id).populate('song');
    if (!v) return res.status(404).json({ message: 'Video not found' });
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
