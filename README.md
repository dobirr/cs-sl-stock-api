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

## Features (Scope)
### Included
- Stock data REST endpoints (quote, profile, search, candles)
- MongoDB cache (TTL-based) for market data
- User auth: register/login/me (JWT)
- Lightweight persistence: portfolios + watchlists
- Swagger UI for endpoint overview + “Try it out”

### Optional / Stretch
- WebSocket streaming (learning-focused)

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- pnpm (recommended package manager)
- MongoDB running locally (your instructor already has MongoDB installed)

### Install
```bash
pnpm install
```

### Environment
```bash
cp .env.example .env
```

### Run (dev)
```bash
pnpm dev
```

### Quick checks (M1)
- Health: `GET /api/v1/health`
- Swagger UI: `GET /api-docs`
