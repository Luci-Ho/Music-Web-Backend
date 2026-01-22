import mongoose from 'mongoose'
import dotenv from 'dotenv';
import fs from 'fs'

import Artist from '../models/Artist.model.js'
import Album from '../models/Album.model.js'
import Song from '../models/Song.model.js'
import Genre from '../models/Genre.model.js'
import Mood from '../models/Mood.model.js'

import { getYoutubeThumbnail } from '../utils/youtube.js';

dotenv.config();

const raw = JSON.parse(fs.readFileSync('./db.json', 'utf-8'))

const artistMap = {}
const albumMap = {}
const genreMap = {}
const moodMap = {}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI)

  // ❌ clear collections (chỉ chạy khi DEV)
  await Promise.all([
    Artist.deleteMany(),
    Album.deleteMany(),
    Song.deleteMany(),
    Genre.deleteMany(),
    Mood.deleteMany()
  ])

  // =====================
  // 1️⃣ ARTISTS
  // =====================
  for (const a of raw.artists) {
    const artist = await Artist.create({
      legacyId: a.id,
      name: a.name,
      img: a.img
    })
    artistMap[a.id] = {
      _id: artist._id,
      name: artist.name
    }
  }

  // =====================
  // 2️⃣ GENRES
  // =====================
  for (const g of raw.genres) {
    const genre = await Genre.create({
      legacyId: g.id,
      title: g.title,
      img: g.img
    })
    genreMap[g.id] = genre._id
  }

  // =====================
  // 3️⃣ MOODS
  // =====================
  for (const m of raw.moods) {
    const mood = await Mood.create({
      legacyId: m.id,
      title: m.title,
      img: m.img
    })
    moodMap[m.id] = mood._id
  }

  // =====================
  // 4️⃣ ALBUMS
  // =====================
  for (const al of raw.albums) {
    const artist = artistMap[al.artistId];

    const album = await Album.create({
      legacyId: al.id,
      title: al.title,
      artistId: artist?._id || null,
      img: al.img
    })
    albumMap[al.id] = album._id
  }

  // =====================
  // 5️⃣ SONGS
  // =====================
  for (const s of raw.songs) {
    const videoThumbnail = getYoutubeThumbnail(s.media?.videoUrl);
   

    const artist = artistMap[s.artistId];
    if (!artist) {
      console.warn('❌ Artist not found for song:', s.title);
      continue;
    }

    await Song.create({
      legacyId: s.id,
      title: s.title,

      artistId: artist._id,
      artistName: artist.name,

      albumId: albumMap[s.albumId] || null,
      genreId: genreMap[s.genreId] || null,
      moodId: moodMap[s.moodId] || null,

      releaseDate: s.releaseDate,
      duration: s.duration,
      lyrics: s.lyrics,

      media: {
        image: s.media?.image || null,
        audioUrl: s.media?.audioUrl || null,
        videoUrl: s.media?.videoUrl || null,
        videoThumbnail // ✅ LƯU VÀO DB
      },
      viewCount: s.viewCount ?? 0
    })
  }

  console.log('✅ MIGRATE SUCCESS')
  process.exit()
}

migrate()
