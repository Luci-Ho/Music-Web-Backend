import express from 'express';
import cors from 'cors';
import songRoutes from './routes/song.routes.js';
import uploadRoutes from './routes/upload.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/songs', songRoutes)

app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('🎵 Melody Music Backend is running');
});

export default app;
