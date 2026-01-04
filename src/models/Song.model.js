import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },

    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },

    moodId: {
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
    tagsId: [
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
