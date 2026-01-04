const user = await User.findById(userId)
  .populate("level")
  .populate({
    path: "favorites",
    populate: ["artist", "album", "genre", "mood"],
  })
  .populate({
    path: "playlists",
    populate: {
      path: "songs",
      populate: ["artist", "album"],
    },
  });