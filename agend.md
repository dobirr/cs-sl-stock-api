# agenda.md — Capstone Backend: Stock Data + Lightweight Portfolio (Express + Mongoose + Finnhub)

## 0) Scope & Non-Goals
### Scope (lightweight)
- Stock Data Access (REST) via Finnhub
- Persistence with MongoDB via **Mongoose**:
  - Cache layer (quotes/candles)
  - Domain data (users + portfolios/watchlists, lightweight)
- Auth: Login + JWT
- Logging: **morgan**
- API Docs + Testing UI: **Swagger/OpenAPI** (`/api-docs`)
- Testing: **Mocha** (runs on a separate local MongoDB test DB; no extra installs)

### Optional / Stretch (not required for submission)
- WebSocket streaming (learning-focused, lightweight)

### Non-Goals (explicit)
- No real trading/execution engine
- No payment/KYC/broker integration
- Deployment optional (keep in mind, not required for submission)

---

## 1) Project Principles (Codex-friendly)
- **Mongoose-first** architecture: models + indexes before feature endpoints
- Service layer isolation:
  - controllers = HTTP glue
  - services = business logic
  - providers = Finnhub integration
  - models = Mongoose schemas
- “Spec-Enforcer + Task-Runner”:
  - every task has Acceptance Criteria + DoD
  - small PRs, each PR must pass lint/test

### 1.1) Working Mode with Codex (Learning-first)
We will implement this project together with Codex by working through the tasks step by step.

Rules for Codex:
- For every task, Codex must first explain:
  - **Goal**: what we are building and why it is needed
  - **Concepts**: short explanation of the relevant concepts (e.g., Express routing, middleware, Mongoose models, JWT)
  - **Plan**: the smallest next steps to implement it (as you would do without AI)
  - **Acceptance Criteria**: what “done” looks like for this task
- Codex should not make large “all-in-one” changes across many files.
  - Prefer small, focused changes and incremental commits/PRs.
- Codex must keep changes minimal and easy to understand:
  - no unnecessary abstractions
  - no “magic” scaffolding
  - no big refactors unless explicitly requested
- After implementation, Codex must provide a short walkthrough:
  - what changed
  - how to run it
  - how to verify it works (manual check or test)
- If something is unclear, Codex must ask a question before implementing.

### Improvement Suggestions & Learning Support (Codex)
- Codex may actively propose improvements and missing parts at any time.
- Every proposal must include:
  - **Why** it is useful (benefit / risk it prevents)
  - **Scope impact** (small/medium/large)
  - **When to do it** (now vs later / optional stretch)
  - **How to verify** it works (manual check or test)
- Codex should prioritize learning:
  - explain tradeoffs and alternatives briefly
  - point out common pitfalls
  - connect each step to the overall architecture
- Goal: maximum learning effect and a clean, maintainable end product.

### Pair-Programming Mode (You code first)
Primary goal: I (the student) write the code.

Rules:
- For each task, Codex should provide a **basic starter approach** (small scaffold / outline / minimal example),
  so I can implement the task myself and build on it.
- After I implement, Codex must:
  - **review my solution**
  - explain **what is good**, **what can be improved**, and **why**
  - suggest **small, incremental changes** (no big refactors)
- If I get stuck, Codex should:
  1) give hints and debugging steps
  2) if still blocked, provide a **reference implementation** for the remaining part of the task
- Codex must keep the code understandable and step-by-step, as if implemented without AI.

---

## 2) Repo Setup (M1)
### 2.1 Package manager + Module system (pnpm + ESM)
- [ ] Use **pnpm** as the package manager
- [ ] Use **ESM imports**:
  - set `"type": "module"` in `package.json`
  - use `import ... from ...` in all source files
- [ ] Standard scripts (pnpm):
  - `pnpm dev` → run server with nodemon
  - `pnpm start` → run server with node
  - `pnpm test` → run mocha with `.env.test`
  - `pnpm lint` → run eslint

### 2.2 Project initialization
- [ ] Initialize Node.js + Express project
- [ ] Folder structure
  - /src
    - /config (env, db, swagger, websocket)
    - /models (mongoose)
    - /routes
    - /controllers
    - /services
    - /providers (finnhub client)
    - /middlewares
    - /utils
  - /tests
  - /docs
- [ ] Tooling: eslint/prettier, nodemon, dotenv
- [ ] Package manager: **pnpm** (use pnpm commands for install/run/test)
- [ ] Logging: **morgan** (HTTP request logging)
- [ ] API Documentation: **OpenAPI (Swagger)**
  - add swagger-ui-express
  - add openapi spec (YAML or JSDoc)
  - expose Swagger UI at `/api-docs`
- [ ] Create env template: `.env.example`
  - PORT
  - MONGODB_URI
  - JWT_SECRET
  - FINNHUB_API_KEY

---

## 3) Mongoose Foundations (M1/M2) — FIRST
### 3.1 DB Connection
- [ ] `/src/config/db.js`
  - connect with retry/backoff
  - log connection state
- [ ] health endpoint includes DB connectivity check

### 3.2 Core Models (minimal)
- [ ] User
  - email (unique), passwordHash, createdAt
- [ ] Portfolio (lightweight)
  - userId (ref User), name
- [ ] Holding (embedded or separate)
  - symbol, quantity, avgPrice (optional)
- [ ] Watchlist (optional but small + useful)
  - userId, name, symbols[]
- [ ] QuoteCache
  - symbol, quote, fetchedAt, expiresAt
- [ ] CandleCache
  - symbol, resolution, from, to, candles, fetchedAt, expiresAt

### 3.3 Index Strategy
- [ ] TTL index on `expiresAt` for cache collections
- [ ] indexes:
  - User.email unique
  - QuoteCache.symbol
  - CandleCache.symbol + resolution + from + to
  - Portfolio.userId
  - Watchlist.userId

---

## 4) Auth (M2)
### 4.1 Endpoints
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET  /api/v1/auth/me

### 4.2 Requirements
- [ ] Password hashing (bcrypt)
- [ ] JWT issue + verify middleware
- [ ] Protect portfolio/watchlist endpoints
- [ ] Public market-data endpoints remain public (unless explicitly changed)

---

## 5) Finnhub Integration (REST) (M3)
### 5.1 Provider Client
- [ ] `/src/providers/finnhubClient.js`
  - axios instance, timeout
  - error normalization (rate limit, invalid symbol, provider downtime)

### 5.2 REST Endpoints (minimum viable)
- GET /api/v1/stocks/quote?symbol=AAPL
- GET /api/v1/stocks/profile?symbol=AAPL
- GET /api/v1/stocks/search?q=apple
- GET /api/v1/stocks/candles?symbol=AAPL&resolution=1D&from=...&to=...

### 5.3 Cache Rules (M3)
- quote: short TTL (e.g. 15–60s)
- profile: long TTL (e.g. 24h)
- candles: medium TTL (e.g. 30–60m)
- cache behavior:
  - cache hit -> return cached
  - cache miss -> call Finnhub, store, return

---

## 6) WebSocket (Optional / Stretch — not required for submission)
### Goal
- Stream live quote updates for a small set of symbols (learning-focused, lightweight).

### Approach (lightweight)
- [ ] WebSocket server (e.g. `ws`) integrated with Express HTTP server
- [ ] Client subscribes to symbols:
  - message: `{ "type": "subscribe", "symbols": ["AAPL","MSFT"] }`
  - optional: `{ "type": "unsubscribe", "symbols": ["AAPL"] }`
- [ ] Server forwards Finnhub stream updates to client
- [ ] Add basic safety:
  - max symbols per connection
  - handle disconnect cleanup
  - rate-limit subscription messages

### Documentation
- Swagger covers REST only; document WebSocket in `/docs/websocket.md`
- Provide a simple test method (`wscat` or a tiny `/docs/ws-client.html`)

---

## 7) Portfolio & Watchlists (lightweight) (M4)
### Portfolio endpoints (JWT protected)
- POST /api/v1/portfolios
- GET  /api/v1/portfolios
- GET  /api/v1/portfolios/:id
- PUT  /api/v1/portfolios/:id/holdings
  - lightweight: replace holdings array
- (optional) DELETE /api/v1/portfolios/:id

### Watchlist endpoints (JWT protected)
- POST /api/v1/watchlists
- GET  /api/v1/watchlists
- PUT  /api/v1/watchlists/:id
- DELETE /api/v1/watchlists/:id

---

## 8) Validation, Errors, Security (M5)
- [ ] Validation (Joi/Zod) for query params + bodies
- [ ] Central error handler with consistent error shape
- [ ] Helmet + CORS + request size limits
- [ ] Request logging with **morgan**
  - include method, path, status, response time
  - add requestId (custom token) for correlation
  - redact sensitive headers (Authorization)
  - environment-based verbosity (dev vs prod)

---

## 9) API Docs (Swagger/OpenAPI)
- [ ] Swagger UI at `/api-docs`
- [ ] All REST endpoints documented with:
  - request params/body schemas
  - response schemas
  - examples (success + error)
- [ ] JWT auth in Swagger:
  - Bearer scheme configured
  - protected endpoints callable via “Authorize” button

---

## 10) Testing (Mocha) & Submission Docs (M5)
### Testing (Mocha)
- [ ] Setup mocha + chai + supertest
- [ ] Provider mocking (avoid real Finnhub in tests)
  - stub Finnhub calls (sinon) to avoid rate limits/flakiness
- [ ] Integration tests:
  - auth: register/login/me
  - portfolios/watchlists: authz + CRUD
  - stocks: quote endpoint
- [ ] Test DB: use local MongoDB with separate database `stockapp_test`
  - `.env.test`: `MONGODB_URI=mongodb://localhost:27017/stockapp_test`
- [ ] Safety guard: refuse to run tests unless `NODE_ENV=test` and DB name contains `_test`
- [ ] Cleanup: `dropDatabase()` before each test for reproducibility
- [ ] Ensure `pnpm test` works on a fresh machine (MongoDB installed, no extra tools)

### Documentation (submission-ready)
- [ ] README:
  - how to run locally (`pnpm install`, `pnpm dev`)
  - env vars
  - link to `/api-docs`
  - note: `pnpm test` resets `stockapp_test` DB automatically
- [ ] /docs:
  - sample requests/responses (or rely on Swagger examples)
  - if WS is implemented: `/docs/websocket.md` + test instructions

---

## 11) Deployment (Later, keep in mind)
- Containerization (Docker) as future-ready option
- Provider secrets + DB secrets strategy (env vars, not committed)
- Consider rate limit + caching behavior for hosted environment

---

## 12) Milestones & DoD
### M1 — Skeleton + DB + Logging + Swagger shell
- DoD:
  - server starts
  - DB connects
  - `/api/v1/health` returns `{ ok: true, db: "up" }`
  - morgan logs each request in dev mode
  - Swagger UI reachable at `/api-docs` (even if minimal)
  - project uses pnpm + `"type": "module"` (ESM imports)

### M2 — Auth + User Model + Swagger auth scheme
- DoD:
  - register/login working
  - JWT middleware protects at least one route
  - passwords hashed
  - Swagger “Authorize” works for protected endpoints

### M3 — Finnhub REST + Cache
- DoD:
  - quote endpoint works
  - cache hit/miss observable (logs or response metadata)
  - TTL index created and verified

### M4 — Portfolio/Watchlist
- DoD:
  - portfolio endpoints persist data per user
  - watchlist endpoints persist data per user
  - access control enforced by JWT

### M5 — Hardening + Tests + Docs
- DoD:
  - mocha tests pass locally using `stockapp_test` (run via `pnpm test`) via `pnpm test`
  - validation & error model consistent
  - Swagger lists all REST endpoints with schemas + examples
  - README + docs complete

### M6 (Optional) — WebSocket streaming
- DoD:
  - client can subscribe to 1–3 symbols and receive live updates
  - documented message formats + how to test
