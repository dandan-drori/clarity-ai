import { db, restrictedDb } from '../../database/index.js';
import { extractPriceDetails } from '../../utils/extract-price-details.js';
import { LlmService } from '../../services/llm/llm.service.js';
import { TIMEFRAMES_TO_INTERVAL } from './transactions.config.js';

export class TransactionsService {
  llmService = null;

  constructor() {
    this.llmService = new LlmService();
  }

  async addTransaction(body) {
    try {
      const { price, merchant, user_id, transaction_date } = body;

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

  async getTransactionsByUserId(userId, params) {
    try {
        const { searchTerm, page, filters } = params;
        
        if (!userId) {
            console.error(`UserId ${userId} does not match any existing user`);
            return;
        }

        let { timeframe } = filters ?? {};

        if (!TIMEFRAMES_TO_INTERVAL[timeframe]) {
            timeframe = 'all_time';
        }

        const intervalValue = TIMEFRAMES_TO_INTERVAL[timeframe];

        let selectQuery = '';
        let values = [];
        if (intervalValue === null) {
            selectQuery = `
            SELECT price, category, merchant, currency, transaction_date
            FROM transactions
            WHERE user_id = $1;
            `;
            values = [userId];
        } else {
            selectQuery = `
            SELECT price, category, merchant, currency, transaction_date
            FROM transactions
            WHERE user_id = $1;
                AND transaction_date >= NOW() - $2::INTERVAL;
            `;
            values = [userId, intervalValue];
        }

        const data = await db.query(selectQuery, values);
        
        console.log(`Successfully fetched ${data?.rowCount} transactions for user ${userId}`);
        return { status: 'success', data: data?.rows };
    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }
  }
}
