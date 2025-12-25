/**
 * Generic API Strategy Factory
 * Creates generic strategies for APIs that don't need special handling
 */
import { APIStrategy } from './base.js';
import { API_PATTERNS } from '../patterns.js';

/**
 * Create a generic strategy for an API
 * @param {string} apiId - API identifier
 * @returns {APIStrategy} Strategy instance
 */
export function createGenericStrategy(apiId) {
  const config = API_PATTERNS[apiId];
  if (!config) {
    throw new Error(`No configuration found for API: ${apiId}`);
  }

  return new APIStrategy({
    ...config,
    id: apiId
  });
}

/**
 * Create strategies for all generic APIs (non-specialized)
 * @returns {Object} Object mapping API IDs to strategy instances
 */
export function createGenericStrategies() {
  const genericAPIs = ['googleMaps', 'openai', 'stripe', 'firebase', 'algolia', 'sendgrid', 'twilio'];
  const strategies = {};

  for (const apiId of genericAPIs) {
    try {
      strategies[apiId] = createGenericStrategy(apiId);
    } catch (error) {
      console.warn(`Failed to create strategy for ${apiId}:`, error.message);
    }
  }

  return strategies;
}
