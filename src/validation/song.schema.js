import Joi from 'joi';

export const createSongSchema = Joi.object({
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().optional().allow(null,''),
  genre: Joi.string().optional().allow(null,''),
  mood: Joi.string().optional().allow(null,''),
  releaseDate: Joi.date().optional(),
  duration: Joi.string().optional().allow(null,''),
  lyrics: Joi.string().optional().allow(null,''),
  media: Joi.object({ image: Joi.string().allow(null,''), audioUrl: Joi.string().allow(null,'') }).optional(),
});

export const updateSongSchema = Joi.object({
  title: Joi.string().optional(),
  artist: Joi.string().optional(),
  album: Joi.string().optional().allow(null,''),
  genre: Joi.string().optional().allow(null,''),
  mood: Joi.string().optional().allow(null,''),
  releaseDate: Joi.date().optional(),
  duration: Joi.string().optional().allow(null,''),
  lyrics: Joi.string().optional().allow(null,''),
  media: Joi.object({ image: Joi.string().allow(null,''), audioUrl: Joi.string().allow(null,'') }).optional(),
});
