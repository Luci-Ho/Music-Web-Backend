// server/src/routes/video.routes.js
import express from "express";
import { 
  getAllVideos,
  getVideoById
} from "../controllers/video.controller.js";

const router = express.Router();

router.get('/', getAllVideos);
router.get('/:id', getVideoById);

export default router;
