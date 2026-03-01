import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerUser);

authRouter.post('/login', loginUser);

authRouter.get('/me', requireAuth, getMe);

export default authRouter;
