import { GoogleGenAI } from '@google/genai';
import { systemInstruction } from './system-prompt.config.js';
import { MERCHANT_CATEGORIES } from './merchant-categories.config.js';

let ai = null;

export class LlmService {
  constructor() {
    // Automatically detects the GEMINI_API_KEY from .env file.
    ai = new GoogleGenAI({});
  }

  async categorizeTransaction(merchantName) {
    const knownCategory = MERCHANT_CATEGORIES[merchantName.toLowerCase()];
    if (knownCategory) return knownCategory;

    try {
      // We use the Gemini 2.5 Flash model, which is lightning fast and free for low volume.
      const response = await ai?.models?.generateContent?.({
        model: 'gemini-2.5-flash',
        contents: `Merchant Name: "${merchantName}"`, // THE USER PROMPT: This is the raw data you want processed.
        config: {
          systemInstruction,
          temperature: 0.1, // Temperature 0.1 ensures highly predictable, deterministic answers.
        },
      });

      if (!response) {
        // If response is undefined, return default category
        return 'Other';
      }

      // CLEAN UP AND RETURN
      return response.text.trim();
    } catch (error) {
      console.error('Error connecting to Gemini:', error);
      // If the API fails (e.g., no internet), default to "Other" so the SQL insert doesn't crash
      return 'Other';
    }
  }
}
