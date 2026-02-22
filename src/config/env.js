import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 3000),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/stockapp',
  jwtSecret: process.env.JWT_SECRET,
};
