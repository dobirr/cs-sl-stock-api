import { Router } from 'express';
import { getProfile, getQuote } from '../controllers/stocks.controller.js';

const stocksRouter = Router();

stocksRouter.get('/quote', getQuote);

stocksRouter.get('/profile', getProfile);

export default stocksRouter;
