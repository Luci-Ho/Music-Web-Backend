import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import songRoutes from "./routes/song.routes.js";
import uploadRoutes from "./routes/upload.route.js";
import authRoutes from "./routes/auth.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import likeRoutes from "./routes/like.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import moodRoutes from "./routes/mood.routes.js";
import artistRoutes from "./routes/artist.routes.js";
import albumRoutes from "./routes/album.routes.js";

import logger from "./config/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// ===== path resolve =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== middlewares =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["'self'", 'http://localhost:4000', 'http://127.0.0.1:4000'],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      },
    },
  })
);

app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ===== static uploads =====
const mediaPath = process.env.MEDIA_PATH || "uploads";
app.use("/media", express.static(mediaPath));

// ===== API routes =====
app.use("/api/songs", songRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/albums", albumRoutes);

// ===== serve React =====
app.use(express.static(path.join(__dirname, "../public/dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/dist/index.html")
  );
});

// ===== error handler (MUST BE LAST) =====
app.use(errorHandler);

export default app;
