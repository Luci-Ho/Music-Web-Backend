import express from 'express';
import cors from 'cors';
import songRoutes from './routes/song.routes.js';
import uploadRoutes from './routes/upload.route.js';
import authRoutes from './routes/auth.routes.js';
import playlistRoutes from './routes/playlist.routes.js';
import likeRoutes from './routes/like.routes.js';
import genreRoutes from './routes/genre.routes.js';
import moodRoutes from './routes/mood.routes.js';
import artistRoutes from './routes/artist.routes.js';
import albumRoutes from './routes/album.routes.js';
import videoRoutes from './routes/video.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// intentionally minimal setup for learning — no production-level hardening

const mediaPath = process.env.MEDIA_PATH || 'uploads';
app.use('/media', express.static(mediaPath));

app.use('/api/songs', songRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/videos', videoRoutes);

// global error handler (last middleware)
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('🎵 Melody Music Backend is running');
});

export default app;
