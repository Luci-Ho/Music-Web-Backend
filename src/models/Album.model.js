import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  
  {
     // 🔁 ID cũ từ db.json (s502...)
    legacyId: {
      type: String,
      index: true,
      unique: true,
    },
    
    title: {
      type: String,
      required: true,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],

    img: String,
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);
