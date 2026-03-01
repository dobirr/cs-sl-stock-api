import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/api/v1/auth/register', registerUser);

authRouter.post('/api/v1/auth/login', loginUser);

authRouter.get('/api/v1/auth/me', requireAuth, getMe);

export default authRouter;
