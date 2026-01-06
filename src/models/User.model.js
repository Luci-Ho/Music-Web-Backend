import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

     // 🔁 ID cũ từ db.json (s502...)
    legacyId: {
      type: String,
      index: true,
      unique: true,
    },
    
    username: String,

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: String,
    phone: String,
    refreshToken: String,
    role: {
      type: String,
      enum: ['admin', 'moderator', 'user'],
      default: 'user',
    },

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
