import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
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
    img: String,
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);
