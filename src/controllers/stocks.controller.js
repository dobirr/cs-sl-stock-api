import {getQuoteService,
  getProfileService,
  searchStocksService,} from '../services/stocks.service.js';

export const getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.query;
    const quote = await getQuoteService(symbol);
    return res.status(200).json(quote);
  } catch (error) {
    return next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { symbol } = req.query;
    const profile = await getProfileService(symbol);
    return res.status(200).json(profile);
  } catch (error) {
    return next(error);
  }
};

export const getSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    const result = await searchStocksService(q);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
