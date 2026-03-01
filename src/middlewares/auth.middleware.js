import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const requireAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    const error = new Error('Authorization token is missing');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (error) {
    const err = new Error('Unauthorized/Invalid token');
    err.statusCode = 401;
    err.cause = error;
    return next(err);
  }
};
