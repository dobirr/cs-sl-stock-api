import finnhubClient, { mapFinnhubError } from '../providers/finnhubClient.provider.js';

export const getQuoteService = async (symbol) => {
  if (!symbol) {
    const error = new Error('Symbol is required');
    error.statusCode = 400;
    throw error;
  }

  try {
    const result = await finnhubClient.get('/quote', { params: { symbol } });
    return result.data;
  } catch (error) {
    const normalized = mapFinnhubError(error);
    const mappedError = new Error(normalized.message);
    mappedError.statusCode = normalized.statusCode;
    throw mappedError;
  }
};
