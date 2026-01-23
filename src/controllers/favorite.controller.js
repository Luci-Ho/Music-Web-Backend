import User from "../models/User.model.js";
import Song from "../models/Song.model.js";

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user?._id; // từ middleware authenticate
    const { songId } = req.params;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Tài khoản không tồn tại" });

    const idx = (user.favorites || []).findIndex((id) => String(id) === String(songId));

    let action = "added";
    if (idx === -1) user.favorites.push(song._id);
    else {
      user.favorites.splice(idx, 1);
      action = "removed";
    }

    await user.save();

    const populatedUser = await User.findById(user._id).populate("favorites");
    return res.json({ action, favorites: populatedUser.favorites || [] });
  } catch (err) {
    console.error("toggleFavorite error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).populate("favorites");
    return res.json(user?.favorites || []);
  } catch (err) {
    console.error("getFavorites error:", err);
    return res.status(500).json({ message: err.message });
  }
};
