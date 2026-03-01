import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';

import { env } from './config/env.js';
import { setupSwagger } from './config/swagger.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

const API_PREFIX = '/api/v1';
const AUTH_BASE = `${API_PREFIX}/auth`;
const HEALTH_BASE = `${API_PREFIX}/health`;

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(HEALTH_BASE, healthRouter);
app.use(AUTH_BASE, authRouter);

setupSwagger(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
