import swaggerUi from 'swagger-ui-express';

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Stock API',
    version: '0.1.0',
    description: 'Backend API for stock data and lightweight portfolios.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      AuthRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', minLength: 6, example: 'secret123' },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a0d8d9b3e65f2f6e01a1' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '65f1a0d8d9b3e65f2f6e01a1' },
              email: { type: 'string', format: 'email', example: 'user@example.com' },
            },
          },
        },
      },
      MeResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a0d8d9b3e65f2f6e01a1' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Invalid email or password' },
        },
      },
      QuoteResponse: {
        type: 'object',
        description: 'Finnhub quote payload',
        properties: {
          c: { type: 'number', description: 'Current price' },
          d: { type: 'number', description: 'Change' },
          dp: { type: 'number', description: 'Percent change' },
          h: { type: 'number', description: 'High price of the day' },
          l: { type: 'number', description: 'Low price of the day' },
          o: { type: 'number', description: 'Open price of the day' },
          pc: { type: 'number', description: 'Previous close price' },
          t: { type: 'number', description: 'Timestamp' },
        },
      },
      ProfileResponse: {
        type: 'object',
        description: 'Finnhub company profile payload',
        properties: {
          country: { type: 'string', example: 'US' },
          currency: { type: 'string', example: 'USD' },
          exchange: { type: 'string', example: 'NASDAQ/NMS (GLOBAL MARKET)' },
          finnhubIndustry: { type: 'string', example: 'Technology' },
          ipo: { type: 'string', example: '1980-12-12' },
          logo: {
            type: 'string',
            example:
              'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.png',
          },
          marketCapitalization: { type: 'number', example: 3200000 },
          name: { type: 'string', example: 'Apple Inc' },
          phone: { type: 'string', example: '14089961010.0' },
          shareOutstanding: { type: 'number', example: 15200 },
          ticker: { type: 'string', example: 'AAPL' },
          weburl: { type: 'string', example: 'https://www.apple.com/' },
        },
      },
      SearchResponse: {
        type: 'object',
        description: 'Finnhub search payload',
        properties: {
          count: { type: 'number', example: 1 },
          result: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'APPLE INC' },
                displaySymbol: { type: 'string', example: 'AAPL' },
                symbol: { type: 'string', example: 'AAPL' },
                type: { type: 'string', example: 'Common Stock' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/api/v1/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service health',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    db: { type: 'string', enum: ['up', 'down'] },
                  },
                },
                example: {
                  ok: true,
                  db: 'up',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'Login user and receive JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        summary: 'Get current authenticated user',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MeResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/stocks/quote': {
      get: {
        summary: 'Get stock quote',
        parameters: [
          {
            name: 'symbol',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'AAPL',
          },
        ],
        responses: {
          200: {
            description: 'Quote data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/QuoteResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Symbol not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          429: {
            description: 'Finnhub rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          502: {
            description: 'Finnhub unavailable',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/stocks/profile': {
      get: {
        summary: 'Get stock profile',
        parameters: [
          {
            name: 'symbol',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'AAPL',
          },
        ],
        responses: {
          200: {
            description: 'Company profile data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProfileResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Symbol not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          429: {
            description: 'Finnhub rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          502: {
            description: 'Finnhub unavailable',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/stocks/search': {
      get: {
        summary: 'Search stocks',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'apple',
          },
        ],
        responses: {
          200: {
            description: 'Search results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SearchResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'No results or symbol not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          429: {
            description: 'Finnhub rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          502: {
            description: 'Finnhub unavailable',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
};
