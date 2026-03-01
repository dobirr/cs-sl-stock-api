import { Router } from 'express';
import { getQuote } from '../controllers/stocks.controller.js';

const stocksRouter = Router();

stocksRouter.get('/quote', getQuote);

export default stocksRouter;
