import express from 'express';
import cors from 'cors';
import songRoutes from './routes/song.routes.js';
import uploadRoutes from './routes/upload.route.js';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mediaPath = process.env.MEDIA_PATH || 'uploads';
app.use('/media', express.static(mediaPath));

app.use('/api/songs', songRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🎵 Melody Music Backend is running');
});

export default app;
