import axios from 'axios';
import { env } from '../config/env.js';

const finnhubClient = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  timeout: 8000,
  params: { token: env.finnhubApiKey },
});

export const mapFinnhubError = (error) => {
  if (error.response?.status === 429)
    return { statusCode: 429, message: 'Finnhub rate limit exceeded' };
  if (error.response?.status === 404) return { statusCode: 404, message: 'Symbol not found' };
  return { statusCode: 502, message: 'Finnhub unavailable' };
};

export default finnhubClient;
