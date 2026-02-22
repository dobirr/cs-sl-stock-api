import mongoose from 'mongoose';

const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const logConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    console.log('[db] connected');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('[db] error:', error.message);
  });
};

logConnectionEvents();

export const getDbHealth = () => (mongoose.connection.readyState === 1 ? 'up' : 'down');

export const connectToDatabase = async (uri) => {
  let attempt = 0;

  while (true) {
    try {
      attempt += 1;
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      return;
    } catch (error) {
      const delay = Math.min(INITIAL_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
      console.error(
        `[db] connection attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms`
      );
      await sleep(delay);
    }
  }
};
