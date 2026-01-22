import mongoose from 'mongoose'

const SongSchema = new mongoose.Schema(
  {
    legacyId: {
      type: String,
      required: false,
      index: true,
      unique: true,
      default: undefined
    },

    title: {
      type: String,
      required: true
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
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
    }
  },

  { timestamps: true }
)

export default mongoose.model('Song', SongSchema)
