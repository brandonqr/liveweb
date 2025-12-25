/**
 * CSS Selector Generator
 * Pure functions for generating CSS selectors from DOM elements
 */

/**
 * Generate a unique CSS selector for an element
 * @param {HTMLElement} element - The DOM element
 * @returns {string} CSS selector
 */
export function generateSelector(element) {
  if (!element || element === document.body || element === document.documentElement) {
    return 'body';
  }

  // Try ID first (most specific)
  if (element.id && element.id.trim() !== '') {
    const idSelector = '#' + element.id;
    try {
      const found = document.querySelector(idSelector);
      if (found === element) {
        return idSelector;
      }
    } catch (e) {
      // Invalid ID, continue
    }
  }

  // Try class names (more specific than tag)
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/).filter(c => c && c !== 'liveweb-hover' && c !== 'liveweb-selected');
    if (classes.length > 0) {
      // Try with all classes first
      const classSelector = '.' + classes.map(c => c.replace(/\./g, '\\.')).join('.');
      try {
        const elements = document.querySelectorAll(classSelector);
        if (elements.length === 1 && elements[0] === element) {
          return classSelector;
        }
        // Try with first class only
        if (classes.length > 1) {
          const singleClassSelector = '.' + classes[0].replace(/\./g, '\\.');
          const singleElements = document.querySelectorAll(singleClassSelector);
          if (singleElements.length === 1 && singleElements[0] === element) {
            return singleClassSelector;
          }
        }
      } catch (e) {
        // Invalid selector, continue
      }
    }
  }

  // Use tag name with nth-of-type for specificity
  const tagName = element.tagName.toLowerCase();
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter(
      child => child.tagName && child.tagName.toLowerCase() === tagName
    );
    const index = siblings.indexOf(element);
    if (siblings.length > 1 && index >= 0) {
      return `${tagName}:nth-of-type(${index + 1})`;
    }
  }

  // Fallback to just tag name
  return tagName;
}

/**
 * Get full path selector (parent > child > grandchild)
 * @param {HTMLElement} element - The DOM element
 * @returns {string} Full CSS selector path
 */
export function getFullSelector(element) {
  const path = [];
  let current = element;

  while (current && current !== document.body && current !== document.documentElement) {
    path.unshift(generateSelector(current));
    current = current.parentElement;
  }

  return path.join(' > ');
}

/**
 * Validate that a CSS selector is valid
 * @param {string} selector - CSS selector to validate
 * @returns {boolean} True if selector is valid
 */
export function validateSelector(selector) {
  if (!selector || typeof selector !== 'string') {
    return false;
  }
  try {
    document.querySelector(selector);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get the code for selector generation functions (for injection into iframe)
 * @returns {string} JavaScript code as string
 */
export function getSelectorGeneratorCode() {
  return `
    function generateSelector(element) {
      if (!element || element === document.body || element === document.documentElement) {
        return 'body';
      }
      
      // Try ID first (most specific)
      if (element.id && element.id.trim() !== '') {
        const idSelector = '#' + element.id;
        try {
          const found = document.querySelector(idSelector);
          if (found === element) {
            return idSelector;
          }
        } catch (e) {
          // Invalid ID, continue
        }
      }
      
      // Try class names (more specific than tag)
      if (element.className && typeof element.className === 'string') {
        const classes = element.className.trim().split(/\\s+/).filter(c => c && c !== 'liveweb-hover' && c !== 'liveweb-selected');
        if (classes.length > 0) {
          // Try with all classes first
          const classSelector = '.' + classes.map(c => c.replace(/\\./g, '\\\\.')).join('.');
          try {
            const elements = document.querySelectorAll(classSelector);
            if (elements.length === 1 && elements[0] === element) {
              return classSelector;
            }
            // Try with first class only
            if (classes.length > 1) {
              const singleClassSelector = '.' + classes[0].replace(/\\./g, '\\\\.');
              const singleElements = document.querySelectorAll(singleClassSelector);
              if (singleElements.length === 1 && singleElements[0] === element) {
                return singleClassSelector;
              }
            }
          } catch (e) {
            // Invalid selector, continue
          }
        }
      }

      // Use tag name with nth-of-type for specificity
      const tagName = element.tagName.toLowerCase();
      const parent = element.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          child => child.tagName && child.tagName.toLowerCase() === tagName
        );
        const index = siblings.indexOf(element);
        if (siblings.length > 1 && index >= 0) {
          return tagName + ':nth-of-type(' + (index + 1) + ')';
        }
      }
      
      // Fallback to just tag name
      return tagName;
    }

    function getFullSelector(element) {
      const path = [];
      let current = element;
      while (current && current !== document.body && current !== document.documentElement) {
        path.unshift(generateSelector(current));
        current = current.parentElement;
      }
      return path.join(' > ');
    }
  `;
}
