import finnhubClient, { mapFinnhubError } from '../providers/finnhubClient.provider.js';
import { QuoteCache } from '../models/quoteCache.model.js';

export const getQuoteService = async (symbol) => {
  if (!symbol) {
    const error = new Error('Symbol is required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  const cached = await QuoteCache.findOne({
    symbol: normalizedSymbol,
    expiresAt: { $gt: new Date() },
  });
  if (cached) return cached.quote;

  try {
    const fresh = await finnhubClient.get('/quote', { params: { symbol: normalizedSymbol } });

    await QuoteCache.findOneAndUpdate(
      { symbol: normalizedSymbol },
      {
        quote: fresh.data,
        fetchedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
      },
      { upsert: true, new: true },
    );

    return fresh.data;
  } catch (error) {
    const normalized = mapFinnhubError(error);
    const mappedError = new Error(normalized.message);
    mappedError.statusCode = normalized.statusCode;
    throw mappedError;
  }
};
