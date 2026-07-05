import express from 'express';
import { requireApiKey } from '../../middlewares/require-api-key.js';
import { requireAuth } from '../../middlewares/require-auth.js';
import { TransactionsService } from './transactions.service.js';

export const transactionsRouter = express.Router();

// initialize dependencies
const transactionsService = new TransactionsService();

transactionsRouter.post('/', requireApiKey, express.json(), async (req, res) => {
  try {
    const transactionAddedResponse = await transactionsService.addTransaction(req.body);
    res.status(201).json(transactionAddedResponse);
  } catch (err) {
    console.error('Webhook Database Error:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

transactionsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { sub: userUuid, email } = req.user;

    const transactions = await transactionsService.getTransactionsByUserId(userUuid, req.query);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
})