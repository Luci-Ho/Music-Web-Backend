import User from "../models/User.model.js";

export const toggleLike = async (userId, songId) => {
  const user = await User.findById(userId);
  const liked = user.favorites.includes(songId);

  user.favorites = liked
    ? user.favorites.filter((id) => id.toString() !== songId)
    : [...user.favorites, songId];

  await user.save();
  return user.favorites;
};
