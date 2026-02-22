import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    await connectToDatabase(env.mongodbUri);
    app.listen(env.port, () => {
      console.log(`[server] listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('[server] failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
