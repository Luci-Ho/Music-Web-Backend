import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import bcrypt from 'bcryptjs';

import Level from '../models/Level.model.js';
import Artist from '../models/Artist.model.js';
import Genre from '../models/Genre.model.js';
import Mood from '../models/Mood.model.js';
import Album from '../models/Album.model.js';
import Song from '../models/Song.model.js';
import User from '../models/User.model.js';
import Playlist from '../models/Playlist.model.js';

const seed = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Promise.all([
      Level.deleteMany({}),
      Artist.deleteMany({}),
      Genre.deleteMany({}),
      Mood.deleteMany({}),
      Album.deleteMany({}),
      Song.deleteMany({}),
      User.deleteMany({}),
      Playlist.deleteMany({}),
    ]);

    // Levels
    const levels = await Level.insertMany([
      { name: 'Admin' },
      { name: 'Moderator' },
      { name: 'User' },
    ]);

    // Artists
    const artists = await Artist.insertMany([
      { name: 'Artist One' },
      { name: 'Artist Two' },
    ]);

    // Genres
    const genres = await Genre.insertMany([
      { title: 'Pop' },
      { title: 'Rock' },
      { title: 'Jazz' },
    ]);

    // Moods
    const moods = await Mood.insertMany([
      { title: 'Happy' },
      { title: 'Sad' },
    ]);

    // Albums
    const albums = await Album.insertMany([
      { title: 'Album A', artist: artists[0]._id, img: null },
      { title: 'Album B', artist: artists[1]._id, img: null },
    ]);

    // Songs
    const songs = await Song.insertMany([
      {
        title: 'Song Alpha',
        artist: artists[0]._id,
        album: albums[0]._id,
        genre: genres[0]._id,
        mood: moods[0]._id,
        releaseDate: new Date(),
        duration: '3:12',
        media: { image: null, audioUrl: null },
      },
      {
        title: 'Song Beta',
        artist: artists[1]._id,
        album: albums[1]._id,
        genre: genres[1]._id,
        mood: moods[1]._id,
        releaseDate: new Date(),
        duration: '4:02',
        media: { image: null, audioUrl: null },
      },
    ]);

    // Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { username: 'admin', email: 'admin@example.com', password: passwordHash, level: levels[0]._id, favorites: [songs[0]._id] },
      { username: 'jane', email: 'jane@example.com', password: passwordHash, level: levels[2]._id },
    ]);

    // Playlists
    await Playlist.insertMany([
      { playlistId: 'pl-1', name: 'Favorites', ownerId: users[0]._id.toString(), isPublic: false, songs: [songs[0]._id.toString()] },
    ]);

    console.log('✅ Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed', err);
    process.exit(1);
  }
};

seed();
