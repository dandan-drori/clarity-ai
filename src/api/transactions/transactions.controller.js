import express from 'express';
import { requireApiKey } from '../../middlewares/require-api-key.js';
import { TransactionsService } from './transactions.service.js';

export const transactionsRouter = express.Router();

transactionsRouter.post('/', requireApiKey, express.json(), async (req, res) => {
  try {
    const transactionsService = new TransactionsService();
    const transactionAddedResponse = await transactionsService.addTransaction(req.body);
    res.status(201).json(transactionAddedResponse);
  } catch (err) {
    console.error('Webhook Database Error:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});