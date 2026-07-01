import { restrictedDb } from '../../database/index.js';
import { extractPriceDetails } from '../../utils/extract-price-details.js';

export class TransactionsService {
  async addTransaction(body) {
    try {
      const { price, category, merchant, user_id, currency, transaction_date } = body;

      const { priceValue, currencyCode } = extractPriceDetails(price);

      const insertQuery = `
      INSERT INTO transactions (price, category, merchant, user_id, currency, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

    let transactionDate = transaction_date;
    if (new Date(transaction_date) === 'Invalid Date') {
        transactionDate = new Date().toISOString();
    }

      const values = [
        priceValue,
        category,
        merchant,
        user_id,
        currencyCode,
        new Date(transactionDate).toISOString(),
      ];

      await restrictedDb.query(insertQuery, values);

      return { status: 'success', message: 'Transaction saved safely.' };
    } catch (err) {
      console.error('Webhook Database Error:', err);
      throw err;
    }
  }
}
