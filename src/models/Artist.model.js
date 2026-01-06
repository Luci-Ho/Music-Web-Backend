import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
     // 🔁 ID cũ từ db.json (s502...)
    legacyId: {
      type: String,
      index: true,
      unique: true,
    },
    
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Artist", artistSchema);
