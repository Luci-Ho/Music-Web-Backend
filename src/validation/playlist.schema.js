import Joi from 'joi';

export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().optional().allow('', null),
  isPublic: Joi.boolean().optional(),
  coverImage: Joi.string().optional().allow('', null),
});

export const updatePlaylistSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow('', null),
  isPublic: Joi.boolean().optional(),
  coverImage: Joi.string().optional().allow('', null),
});
