import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRouter from './routes/health.routes.js';
import { setupSwagger } from './config/swagger.js';
import { env } from './config/env.js';

const app = express();

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(healthRouter);

setupSwagger(app);

export default app;
