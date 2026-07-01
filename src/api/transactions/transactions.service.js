import { restrictedDb } from '../../database/index.js';
import { extractPriceDetails } from '../../utils/extract-price-details.js';
import { LlmService } from '../../services/llm/llm.service.js';

export class TransactionsService {
  llmService = null;

  constructor() {
    this.llmService = new LlmService();
  }

  async addTransaction(body) {
    try {
      const { price, merchant, user_id, currency, transaction_date } = body;

      const { priceValue, currencyCode } = extractPriceDetails(price);

      const insertQuery = `
      INSERT INTO transactions (price, category, merchant, user_id, currency, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

      let transactionDate = transaction_date;
      if (new Date(transaction_date) === 'Invalid Date') {
        transactionDate = new Date().toISOString();
      }

      const category = await this.llmService.categorizeTransaction(merchant);

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
