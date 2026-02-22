import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/api/v1/auth/register', registerUser);

authRouter.post('/api/v1/auth/login', loginUser);

export default authRouter;
