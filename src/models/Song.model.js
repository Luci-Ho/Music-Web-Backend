import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },

    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },

    mood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mood",
    },

    releaseDate: Date,
    duration: String,
    lyrics: String,

    media: {
      image: String,
      audioUrl: String,
      musicVideoId: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],

    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Song', songSchema);
