/**
 * API Detector
 * Uses strategies to detect required APIs in code
 */

/**
 * Detect which APIs are required in the code
 * @param {string} code - Code to analyze
 * @param {Object} strategies - Object mapping API IDs to strategy instances
 * @returns {Array} Array of detected API information objects
 */
export function detectRequiredAPIs(code, strategies) {
  if (!code || typeof code !== 'string') {
    return [];
  }

  const detectedAPIs = [];

  for (const [apiId, strategy] of Object.entries(strategies)) {
    if (strategy && typeof strategy.detect === 'function') {
      if (strategy.detect(code)) {
        detectedAPIs.push(strategy.getInfo());
      }
    }
  }

  return detectedAPIs;
}
