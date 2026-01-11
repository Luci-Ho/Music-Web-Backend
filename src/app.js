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
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
//import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import morgan from 'morgan';
import logger from './config/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import  {getHomeData } from './controllers/home.controller.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sanitize
// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//     allowDots: true,
//     onSanitize: ({ req, key }) => {
//       console.warn(`Sanitized key: ${key}`);
//     },
//     // 🚨 QUAN TRỌNG
//     sanitizeQuery: false,
//   })
// );

// security headers
app.use(helmet());

// request logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// app.use(xss());

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
// app.use('/api/videos', videoRoutes);
app.use('/api/home', getHomeData);
// global error handler (last middleware)
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('🎵 Melody Music Backend is running');
});

export default app;
