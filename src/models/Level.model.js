import mongoose from "mongoose";

const levelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Admin, Moderator, User
    },
  },
  { timestamps: true }
);

export default mongoose.model("Level", levelSchema);