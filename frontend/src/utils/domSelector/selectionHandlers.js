/**
 * Selection Handlers
 * Event handlers for element selection in iframe
 */

/**
 * Get the target element from an event, skipping non-selectable elements
 * @param {Event} event - DOM event
 * @returns {HTMLElement|null} Target element or null
 */
export function getTargetElement(event) {
  // Use target (the actual element under the cursor) instead of currentTarget
  // This ensures we get the most specific element the user is hovering/clicking
  let element = event.target;

  // Skip non-selectable elements and find the closest selectable parent
  const skipTags = ['script', 'style', 'meta', 'link', 'title', 'head', 'noscript'];
  while (element && element !== document.body && element !== document.documentElement) {
    const tagName = element.tagName?.toLowerCase();
    if (!tagName || !skipTags.includes(tagName)) {
      // Found a selectable element
      break;
    }
    element = element.parentElement;
  }

  // Don't select body or html
  if (!element || element === document.body || element === document.documentElement) {
    return null;
  }

  return element;
}

/**
 * Get the code for selection handlers (for injection into iframe)
 * @returns {string} JavaScript code as string
 */
export function getSelectionHandlersCode() {
  return `
    function getTargetElement(e) {
      // Use target (the actual element under the cursor) instead of currentTarget
      // This ensures we get the most specific element the user is hovering/clicking
      let element = e.target;
      
      // Skip non-selectable elements and find the closest selectable parent
      const skipTags = ['script', 'style', 'meta', 'link', 'title', 'head', 'noscript'];
      while (element && element !== document.body && element !== document.documentElement) {
        const tagName = element.tagName?.toLowerCase();
        if (!tagName || !skipTags.includes(tagName)) {
          // Found a selectable element
          break;
        }
        element = element.parentElement;
      }
      
      // Don't select body or html
      if (!element || element === document.body || element === document.documentElement) {
        return null;
      }
      
      return element;
    }

    function createHighlight() {
      if (highlightStyle) return;
      highlightStyle = document.createElement('style');
      highlightStyle.id = 'liveweb-selection-style';
      highlightStyle.textContent = \`
        .liveweb-hover {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
          cursor: pointer !important;
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
        .liveweb-selected {
          outline: 3px solid #10b981 !important;
          outline-offset: 2px !important;
          background-color: rgba(16, 185, 129, 0.15) !important;
          position: relative !important;
        }
        .liveweb-selected::after {
          content: '✓ Seleccionado';
          position: absolute;
          top: -25px;
          left: 0;
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          z-index: 10000;
          pointer-events: none;
        }
      \`;
      document.head.appendChild(highlightStyle);
    }

    function removeHighlight() {
      if (highlightStyle) {
        highlightStyle.remove();
        highlightStyle = null;
      }
      document.querySelectorAll('.liveweb-hover, .liveweb-selected').forEach(el => {
        el.classList.remove('liveweb-hover', 'liveweb-selected');
      });
    }

    function handleMouseOver(e) {
      if (!isSelectionMode) return;
      const element = getTargetElement(e);
      if (!element) return;
      
      e.stopPropagation();
      e.stopImmediatePropagation();
      removeHighlight();
      createHighlight();
      element.classList.add('liveweb-hover');
    }

    function handleMouseOut(e) {
      if (!isSelectionMode) return;
      const element = getTargetElement(e);
      if (element) {
        element.classList.remove('liveweb-hover');
      }
    }

    function handleClick(e) {
      if (!isSelectionMode) return;
      const element = getTargetElement(e);
      if (!element) return;
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      removeHighlight();
      selectedElement = element;
      selectedElement.classList.add('liveweb-selected');
      
      const info = getElementInfo(selectedElement);
      if (info && window.parent) {
        window.parent.postMessage({
          type: 'ELEMENT_SELECTED',
          elementInfo: info
        }, '*');
      }
    }
  `;
}
