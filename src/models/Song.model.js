import mongoose from 'mongoose';
import { removeVietnameseTones } from '../utils/removeVietnameseTones.js';

const SongSchema = new mongoose.Schema(
  {
    legacyId: {
      type: String,
      required: true,
      index: true,
      unique: true
    },

    title: {
      type: String,
      required: true
    },

    titleNoAccent: {
      type: String,
      index: true,
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },

    artistName: {
      type: String,
      required: true
    },

    artistNameNoAccent: {
      type: String,
      index: true
    },

    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      default: null //không phải bài hát nào cũng có album
    },

    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: false
    },

    moodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mood',
      required: false
    },

    releaseDate: {
      type: Date
    },

    duration: String,
    lyrics: String,

    media: {
      image: String,
      audioUrl: String,
      videoUrl: String,

      videoThumbnail: String
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isFeatured: { type: Boolean, default: false },

    viewCount: {
      type: Number,
      default: 0
    },
  },

  { timestamps: true }
);

SongSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.titleNoAccent = removeVietnameseTones(this.title)
  }

  if (this.isModified('artistName')) {
    this.artistNameNoAccent = removeVietnameseTones(this.artistName)
  }
})


export default mongoose.model('Song', SongSchema)
