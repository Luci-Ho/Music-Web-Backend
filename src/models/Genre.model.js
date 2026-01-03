import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    img: String,
  },
  { timestamps: true }
);

export default mongoose.model("Genre", genreSchema);