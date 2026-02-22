import { env } from '../src/config/env.js';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('Refusing to run tests: NODE_ENV must be "test".');
}

if (!env.mongodbUri.includes('_test')) {
  throw new Error('Refusing to run tests: MONGODB_URI must contain "_test".');
}
