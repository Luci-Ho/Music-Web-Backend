import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
  },
  { _id: false }
);

const songSchema = new mongoose.Schema(
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
      trim: true,
    },

    // 🔗 LIÊN KẾT (giữ dạng Id cho đúng data cũ)
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      index: true,
    },

    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      index: true,
    },

    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      index: true,
    },

    moodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mood',
      index: true,
    },

    // 📅 chuẩn Date (bạn đã đồng ý đổi)
    releaseDate: {
      type: Date,
      index: true,
    },

    duration: {
      type: String, // "3:24"
    },

    lyrics: {
      type: String,
    },

    media: mediaSchema,

    viewCount: {
      type: Number,
      default: 0,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'songs', // 👈 QUAN TRỌNG NHẤT

    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model('Song', songSchema);
