import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string().allow('').optional(),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'any.required': 'Email là bắt buộc',
      'string.email': 'Email không hợp lệ',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'any.required': 'Mật khẩu là bắt buộc',
      'string.min': 'Mật khẩu tối thiểu 6 ký tự',
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{9,12}$/)
    .required()
    .messages({
      'any.required': 'Số điện thoại là bắt buộc',
      'string.pattern.base': 'Số điện thoại không hợp lệ',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
