import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectToDatabase } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { User } from '../src/models/user.model.js';

describe('Auth API', () => {
  before(async () => {
    await connectToDatabase(env.mongodbUri);
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('POST /api/v1/auth/register -> 201', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com', password: 'secret123' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('email', 'test@example.com');
  });

  it('POST /api/v1/auth/register duplicate -> 409', async () => {
    await User.create({ email: 'dup@example.com', passwordHash: 'hash' });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'dup@example.com', password: 'secret123' });

    expect(res.status).to.equal(409);
  });

  it('POST /api/v1/auth/login -> 200 + token', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'login@example.com', password: 'secret123' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'secret123' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.user).to.have.property('email', 'login@example.com');
  });

  it('POST /api/v1/auth/login wrong password -> 401', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'wrongpw@example.com', password: 'secret123' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'wrongpw@example.com', password: 'badpw' });

    expect(res.status).to.equal(401);
  });
});
