import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    img: String,
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);
