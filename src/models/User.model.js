import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: String,
    phone: String,

    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],

    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
