import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    // ID cũ từ dbjson (s501, s502...)
    legacyId: {
      type: String,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 👉 GIỮ artistId (KHÔNG dùng artist)
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

    musicVideoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MusicVideo',
      index: true,
    },

    duration: {
      type: String, // "4:23"
    },

    // ✅ DÙNG DATE (backend đã viết đúng)
    releaseDate: {
      type: Date,
      index: true,
    },

    lyrics: {
      type: String,
    },

    // 👉 GIỮ THEO DATA CŨ
    img: {
      type: String,
    },

    streaming_links: {
      audio_url: {
        type: String,
        required: true,
      },
    },

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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model('Song', songSchema);
