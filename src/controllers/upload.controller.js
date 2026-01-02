import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // UPLOAD LÊN CLOUDINARY
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video', // mp3 / wav BẮT BUỘC
      folder: 'songs',
    });

    // XOÁ FILE TẠM (QUAN TRỌNG)
    fs.unlinkSync(req.file.path);

    // TRẢ LINK CLOUDINARY
    res.status(200).json({
      audio_url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
