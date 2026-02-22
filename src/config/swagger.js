import swaggerUi from 'swagger-ui-express';

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Stock API',
    version: '0.1.0',
    description: 'Backend API for stock data and lightweight portfolios.',
  },
  servers: [{ url: 'http://localhost:3000' }],
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
  },
};

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
};
