import mongoose from "mongoose";
import { removeVietnameseTones } from "../utils/removeVietnameseTones.js";

const artistSchema = new mongoose.Schema(
  {
    // 🔁 ID cũ từ db.json (s502...)
    legacyId: {
      type: String,
    },

    name: {
      type: String,
      required: true,
    },

    nameNoAccent: {
      type: String,
      index: true
    },
    
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

artistSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.nameNoAccent = removeVietnameseTones(this.name);
  }
});


export default mongoose.model("Artist", artistSchema);
