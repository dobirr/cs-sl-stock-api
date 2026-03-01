import { expect } from 'chai';
import mongoose from 'mongoose';
import request from 'supertest';
import sinon from 'sinon';
import app from '../src/app.js';
import { connectToDatabase } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import finnhubClient from '../src/providers/finnhubClient.provider.js';

describe('Stocks API', () => {
  before(async () => {
    await connectToDatabase(env.mongodbUri);
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    sinon.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('GET /api/v1/stocks/quote without symbol -> 400', async () => {
    const res = await request(app).get('/api/v1/stocks/quote');
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message');
  });

  it('GET /api/v1/stocks/quote -> 200', async () => {
    const mockQuote = { c: 123.45, d: 1.1, dp: 0.9, h: 124.0, l: 122.0, o: 123.0, pc: 122.3, t: 1 };
    const stub = sinon.stub(finnhubClient, 'get').resolves({ data: mockQuote });

    const res = await request(app).get('/api/v1/stocks/quote').query({ symbol: 'AAPL' });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockQuote);
    expect(stub.calledOnce).to.equal(true);
  });

  it('GET /api/v1/stocks/quote uses cache on repeated symbol', async () => {
    const mockQuote = { c: 222.22, d: 2.2, dp: 1.0, h: 223.0, l: 220.0, o: 221.0, pc: 220.5, t: 2 };
    const stub = sinon.stub(finnhubClient, 'get').resolves({ data: mockQuote });

    const first = await request(app).get('/api/v1/stocks/quote').query({ symbol: 'MSFT' });
    const second = await request(app).get('/api/v1/stocks/quote').query({ symbol: 'MSFT' });

    expect(first.status).to.equal(200);
    expect(second.status).to.equal(200);
    expect(second.body).to.deep.equal(mockQuote);
    expect(stub.calledOnce).to.equal(true);
  });

  it('GET /api/v1/stocks/quote maps provider 429 -> 429', async () => {
    const providerError = new Error('Rate limit');
    providerError.response = { status: 429 };
    sinon.stub(finnhubClient, 'get').rejects(providerError);

    const res = await request(app).get('/api/v1/stocks/quote').query({ symbol: 'TSLA' });

    expect(res.status).to.equal(429);
    expect(res.body).to.deep.equal({ message: 'Finnhub rate limit exceeded' });
  });

  it('GET /api/v1/stocks/profile -> 200', async () => {
    const mockProfile = {
      country: 'US',
      currency: 'USD',
      exchange: 'NASDAQ',
      name: 'Apple Inc',
      ticker: 'AAPL',
    };
    const stub = sinon.stub(finnhubClient, 'get').resolves({ data: mockProfile });

    const res = await request(app).get('/api/v1/stocks/profile').query({ symbol: 'AAPL' });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockProfile);
    expect(stub.calledOnce).to.equal(true);
  });

  it('GET /api/v1/stocks/search without q -> 400', async () => {
    const res = await request(app).get('/api/v1/stocks/search');
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message');
  });

  it('GET /api/v1/stocks/search -> 200', async () => {
    const mockSearch = {
      count: 1,
      result: [
        {
          description: 'APPLE INC',
          displaySymbol: 'AAPL',
          symbol: 'AAPL',
          type: 'Common Stock',
        },
      ],
    };
    const stub = sinon.stub(finnhubClient, 'get').resolves({ data: mockSearch });

    const res = await request(app).get('/api/v1/stocks/search').query({ q: 'apple' });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockSearch);
    expect(stub.calledOnce).to.equal(true);
  });
});
