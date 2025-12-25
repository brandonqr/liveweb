import { GoogleGenAI, ApiError } from '@google/genai';
import { GEMINI_API_KEY } from '../../config/index.js';
import { GEMINI_MAX_RETRIES, RETRYABLE_STATUS_CODES, RETRY_DELAY_BASE } from '../../config/constants.js';

// Initialize Gemini AI client
const ai = new GoogleGenAI({ 
  apiKey: GEMINI_API_KEY 
});

/**
 * Generate content with automatic retry for temporary errors
 * @param {Object} params - Parameters for generateContent
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise} Response from Gemini API
 */
export async function generateContentWithRetry(params, maxRetries = GEMINI_MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent(params);
      
      // Log success after retry if it was a retry attempt
      if (attempt > 0) {
        console.log(`✓ Request succeeded after ${attempt} retry attempt(s)`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // Only retry on temporary server errors
      if (error instanceof ApiError && RETRYABLE_STATUS_CODES.includes(error.status)) {
        
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt) * RETRY_DELAY_BASE;
          const delaySeconds = (delay / 1000).toFixed(1);
          console.warn(`⚠️  Temporary server error (${error.status}). Retrying in ${delaySeconds}s... (${attempt + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          // Max retries reached
          console.error(`✗ Request failed after ${maxRetries + 1} attempts. Last error: ${error.status}`);
        }
      }
      
      // For non-retryable errors or max retries reached, throw immediately
      throw error;
    }
  }
  
  // Should never reach here, but just in case
  throw lastError;
}
