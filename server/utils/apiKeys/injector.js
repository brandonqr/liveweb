/**
 * API Key Injector
 * Uses strategies to inject API keys into code
 */

/**
 * Inject API keys into code using appropriate strategies
 * @param {string} code - Original code
 * @param {Object} apiKeys - Object mapping API IDs to keys: { mapbox: 'pk...', gemini: 'AIza...' }
 * @param {Object} strategies - Object mapping API IDs to strategy instances
 * @returns {string} Code with API keys injected
 */
export function injectAPIKeys(code, apiKeys, strategies) {
  if (!code || !apiKeys || Object.keys(apiKeys).length === 0) {
    return code;
  }

  let injectedCode = code;

  for (const [apiId, apiKey] of Object.entries(apiKeys)) {
    const strategy = strategies[apiId];
    if (!strategy || !apiKey) continue;

    if (typeof strategy.inject === 'function') {
      injectedCode = strategy.inject(injectedCode, apiKey);
    }
  }

  return injectedCode;
}
