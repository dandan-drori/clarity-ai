import { restrictedDb } from '../../database/index.js';

export class TransactionsService {
  async addTransaction(body) {
    try {
      const { price, category, merchant, user_id, currency, transaction_date } = body;

      const insertQuery = `
      INSERT INTO transactions (price, category, merchant, user_id, currency, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

      const values = [
        price,
        category,
        merchant,
        user_id,
        currency,
        transaction_date,
      ];

      await restrictedDb.query(insertQuery, values);

      return { status: 'success', message: 'Transaction saved safely.' };
    } catch (err) {
      console.error('Webhook Database Error:', err);
      throw err;
    }
  }
}
