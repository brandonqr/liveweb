/**
 * API Keys Detector
 * Main entry point for API key detection and injection
 * Maintains backward compatibility with original API
 */

import { API_PATTERNS } from './patterns.js';
import { MapboxStrategy } from './strategies/mapbox.js';
import { GeminiStrategy } from './strategies/gemini.js';
import { createGenericStrategies } from './strategies/generic.js';
import { detectRequiredAPIs } from './detector.js';
import { injectAPIKeys as injectAPIKeysWithStrategies } from './injector.js';

// Register all strategies
const strategies = {
  mapbox: new MapboxStrategy(),
  gemini: new GeminiStrategy(),
  ...createGenericStrategies()
};

/**
 * Detect which APIs are required in the code
 * @param {string} code - Code to analyze
 * @returns {Array} Array of detected API information objects
 */
export function detectRequiredAPIKeys(code) {
  return detectRequiredAPIs(code, strategies);
}

/**
 * Inject API keys into code
 * @param {string} code - Original code
 * @param {Object} apiKeys - Object mapping API IDs to keys
 * @returns {string} Code with API keys injected
 */
export function injectAPIKeys(code, apiKeys) {
  return injectAPIKeysWithStrategies(code, apiKeys, strategies);
}

/**
 * Get configuration for a specific API
 * @param {string} apiId - API identifier
 * @returns {Object|null} API configuration or null
 */
export function getAPIConfig(apiId) {
  return API_PATTERNS[apiId] || null;
}

/**
 * Get all API configurations
 * @returns {Object} All API configurations
 */
export function getAllAPIConfigs() {
  return API_PATTERNS;
}
