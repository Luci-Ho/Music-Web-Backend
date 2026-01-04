import mongoose from 'mongoose';
import Song from '../models/Song.model.js';
import Artist from '../models/Artist.model.js';
import Album from '../models/Album.model.js';
import Genre from '../models/Genre.model.js';
import Mood from '../models/Mood.model.js';
import dotenv from 'dotenv';
//lien ket id voi _id, sau nay update thi khong can push them id, de _id tu sinh
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const migrate = async () => {
  const songs = await Song.find({ artistId: { $type: 'string' } });

  console.log(`🔍 Found ${songs.length} songs to migrate`);

  for (const song of songs) {
    const artist = await Artist.findOne({ legacyId: song.artistId });
    const album = await Album.findOne({ legacyId: song.albumId });
    const genre = await Genre.findOne({ legacyId: song.genreId });
    const mood = await Mood.findOne({ legacyId: song.moodId });

    if (!artist) {
      console.log(`❌ Artist not found: ${song.artistId}`);
      continue;
    }

    song.legacyId = song.id; // giữ id cũ
    song.artistId = artist._id;
    song.albumId = album?._id;
    song.genreId = genre?._id;
    song.moodId = mood?._id;

    song.id = undefined; // xoá field cũ

    await song.save();
    console.log(`✅ Migrated song: ${song.title}`);
  }

  console.log('🎉 Migration completed');
  process.exit(0);
};

migrate();

