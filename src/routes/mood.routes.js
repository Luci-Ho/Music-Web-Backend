import express from 'express';
import { getAllMoods, getMoodById, getSongsByMood } from '../controllers/mood.controller.js';

const router = express.Router();

router.get('/', getAllMoods);
router.get('/:_id', getMoodById);
router.get('/:_id/songs', getSongsByMood);

export default router;
