/**
 * Selection Script Builder
 * Builds the complete selection script for injection into iframe
 */

import { getSelectorGeneratorCode } from './selectorGenerator.js';
import { getElementExtractorCode } from './elementExtractor.js';
import { getSelectionHandlersCode } from './selectionHandlers.js';

/**
 * Build the complete selection script for injection into iframe
 * @returns {string} Complete JavaScript code as string
 */
export function buildSelectionScript() {
  const selectorCode = getSelectorGeneratorCode();
  const extractorCode = getElementExtractorCode();
  const handlersCode = getSelectionHandlersCode();

  return `
(function() {
  let isSelectionMode = false;
  let selectedElement = null;
  let highlightStyle = null;

  ${selectorCode}

  ${extractorCode}

  ${handlersCode}

  window.addEventListener('message', function(event) {
    if (event.data.type === 'ENABLE_SELECTION') {
      isSelectionMode = true;
      createHighlight();
      // Use capture phase to catch events before they reach other handlers
      document.addEventListener('mouseover', handleMouseOver, { capture: true, passive: false });
      document.addEventListener('mouseout', handleMouseOut, { capture: true, passive: false });
      document.addEventListener('click', handleClick, { capture: true, passive: false });
      
      // Notify parent that selection mode is ready
      if (window.parent) {
        window.parent.postMessage({
          type: 'SELECTION_READY'
        }, '*');
      }
    } else if (event.data.type === 'DISABLE_SELECTION') {
      isSelectionMode = false;
      removeHighlight();
      selectedElement = null;
      document.removeEventListener('mouseover', handleMouseOver, { capture: true });
      document.removeEventListener('mouseout', handleMouseOut, { capture: true });
      document.removeEventListener('click', handleClick, { capture: true });
    } else if (event.data.type === 'CLEAR_SELECTION') {
      removeHighlight();
      selectedElement = null;
    }
  });
  
  // Notify parent when script is loaded and ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (window.parent) {
        window.parent.postMessage({
          type: 'SELECTION_SCRIPT_READY'
        }, '*');
      }
    });
  } else {
    // DOM already loaded
    if (window.parent) {
      window.parent.postMessage({
        type: 'SELECTION_SCRIPT_READY'
      }, '*');
    }
  }
})();
  `.trim();
}
