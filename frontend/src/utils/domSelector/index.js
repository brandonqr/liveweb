/**
 * DOM Selector Utilities
 * Re-exports all public functions and maintains backward compatibility
 */

// Export selector generator functions
export { generateSelector, getFullSelector, validateSelector } from './selectorGenerator.js';

// Export element extractor functions
export { extractElementHTML, getElementInfo, normalizeElementAttributes } from './elementExtractor.js';

// Export selection script builder
export { buildSelectionScript } from './selectionScript.js';

// Export the compiled selection script (for backward compatibility)
import { buildSelectionScript } from './selectionScript.js';
export const selectionScript = buildSelectionScript();
