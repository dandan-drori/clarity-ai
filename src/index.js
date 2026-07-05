import express from 'express';
import { db, restrictedDb } from './database/index.js';
import { transactionsRouter } from './api/transactions/transactions.controller.js';
import { healthRouter } from './api/health/health.controller.js';
import { setupGracefulShutdown } from './utils/shutdown.js';

const app = express();
const PORT = process.env.PORT || 5053;

app.use('/api/health/liveness', healthRouter);
app.use('/api/webhook', transactionsRouter);
app.use('/api/transactions', transactionsRouter);

async function startApp() {
  await db.connect();
  await restrictedDb.connect();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });

  setupGracefulShutdown(server, db, restrictedDb);
}

startApp();