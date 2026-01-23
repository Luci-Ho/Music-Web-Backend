import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    legacyId: {
      type: String,
      index: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['admin', 'moderator', 'user'],
      default: 'user',
      index: true,
    },

    // // ⭐ optional – dùng sau
    // level: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Level",
    // },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
      },
    ],

    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
      },
    ],

    refreshToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
