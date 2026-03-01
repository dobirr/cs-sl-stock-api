import mongoose from 'mongoose';

const quoteCacheSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    index: true,
  },
  quote: {
    type: Object,
    required: true,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: {
      expires: 0,
    },
  },
});

export const QuoteCache = mongoose.model('QuoteCache', quoteCacheSchema);
