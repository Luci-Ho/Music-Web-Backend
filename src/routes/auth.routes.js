import express from 'express';
import { signup, login, refresh, me,} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { signupSchema, loginSchema, } from '../validation/auth.schema.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);

router.get('/me', authenticate, me);



export default router;
