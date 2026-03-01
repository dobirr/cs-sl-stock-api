import { Router } from 'express';
import { getProfile, getQuote, getSearch } from '../controllers/stocks.controller.js';

const stocksRouter = Router();

stocksRouter.get('/quote', getQuote);

stocksRouter.get('/profile', getProfile);

stocksRouter.get('/search', getSearch);

export default stocksRouter;
