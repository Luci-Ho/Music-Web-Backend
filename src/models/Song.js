import mongoose from 'mongoose';

const streamingLinksSchema = new mongoose.Schema(
  {
    audio_url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    artist_avatar: {
      type: String,
    },

    cover_url: {
      type: String,
    },

    album: {
      type: String,
    },

    release_date: {
      type: Date,
    },

    duration: {
      type: String, // "3:45"
    },

    genre: {
      type: String,
      index: true,
    },

    video_url: {
      type: String,
    },

    lyrics: {
      type: String,
    },

    streaming_links: streamingLinksSchema,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    viewCount: {
      type: Number,
      default: 0,
      index:true, //
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Song', songSchema);
