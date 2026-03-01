# cs-sl-stock-backend (Capstone)

Backend API for stock market data access (Finnhub) plus lightweight user/portfolio/watchlist persistence.

## Tech Stack

- Node.js + Express
- MongoDB + **Mongoose**
- Finnhub API (REST) via Axios
- Auth: **JWT**
- Logging: **morgan**
- API Docs & Testing UI: **Swagger/OpenAPI** (`/api-docs`)
- Tests: **Mocha** (+ Chai + Supertest)

---

## Current Features

- Health endpoint with DB status: `GET /api/v1/health`
- Auth endpoints:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me` (JWT protected)
- Stocks endpoint:
  - `GET /api/v1/stocks/quote?symbol=AAPL`
  - `GET /api/v1/stocks/profile?symbol=AAPL`
  - `GET /api/v1/stocks/search?q=apple`
- Quote cache in MongoDB (`QuoteCache`) with TTL-based expiration
- Swagger UI at `GET /api-docs`
- Integration tests for auth + stocks (quote/profile/search)

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- pnpm
- MongoDB running locally

### Install

```bash
pnpm install
```

### Environment

Create runtime env:

```bash
cp .env.example .env
```

Required variables in `.env`:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `FINNHUB_API_KEY`

Create test env:

```bash
cp .env.example .env.test
```

Use a dedicated test DB in `.env.test`, for example:

- `MONGODB_URI=mongodb://localhost:27017/stockapp_test`

### Run (dev)

```bash
pnpm dev
```

### Scripts

- `pnpm dev` start server with nodemon
- `pnpm start` start server with node
- `pnpm lint` run eslint
- `pnpm lint:fix` run eslint autofix
- `pnpm format` run prettier write
- `pnpm format:check` run prettier check
- `pnpm test` run mocha tests with `.env.test`

### Quick API checks

- Health: `GET /api/v1/health`
- Swagger UI: `GET /api-docs`

Register:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'
```

Quote:

```bash
curl "http://localhost:3000/api/v1/stocks/quote?symbol=AAPL"
```

Profile:

```bash
curl "http://localhost:3000/api/v1/stocks/profile?symbol=AAPL"
```

Search:

```bash
curl "http://localhost:3000/api/v1/stocks/search?q=apple"
```
