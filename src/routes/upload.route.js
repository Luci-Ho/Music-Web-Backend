import express from 'express';
import upload from '../middlewares/upload.js';
import { uploadAudio } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/audio', upload.single('audio'), uploadAudio);

export default router;
