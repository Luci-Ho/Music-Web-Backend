// server/src/routes/video.routes.js
import express from "express";

const router = express.Router();

// Ví dụ route
router.get("/", (req, res) => {
  res.send("Video route working!");
});

export default router;
