export const toggleFollowArtist = async (userId, artistId) => {
  const user = await User.findById(userId);

  const followed = user.followingArtists.includes(artistId);
  user.followingArtists = followed
    ? user.followingArtists.filter((id) => id.toString() !== artistId)
    : [...user.followingArtists, artistId];

  await user.save();
};
