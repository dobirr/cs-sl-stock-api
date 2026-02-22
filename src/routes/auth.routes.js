import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/api/v1/auth/register', registerUser);

export default authRouter;
