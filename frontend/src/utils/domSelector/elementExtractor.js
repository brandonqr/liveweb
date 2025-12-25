/**
 * Element Extractor
 * Functions for extracting HTML and information from DOM elements
 */

import { generateSelector, getFullSelector } from './selectorGenerator.js';

/**
 * Extract HTML code of an element and its children
 * @param {HTMLElement} element - The DOM element
 * @returns {string} HTML code
 */
export function extractElementHTML(element) {
  if (!element) return '';
  return element.outerHTML;
}

/**
 * Normalize element attributes to a plain object
 * @param {HTMLElement} element - The DOM element
 * @returns {Object} Normalized attributes object
 */
export function normalizeElementAttributes(element) {
  if (!element || !element.attributes) {
    return {};
  }
  return Array.from(element.attributes).reduce((acc, attr) => {
    acc[attr.name] = attr.value;
    return acc;
  }, {});
}

/**
 * Get element information for context
 * @param {HTMLElement} element - The DOM element
 * @returns {Object|null} Element information
 */
export function getElementInfo(element) {
  if (!element) return null;

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || null,
    className: element.className || null,
    selector: generateSelector(element),
    fullSelector: getFullSelector(element),
    html: extractElementHTML(element),
    textContent: element.textContent?.trim().substring(0, 100) || null,
    attributes: normalizeElementAttributes(element)
  };
}

/**
 * Get the code for element extraction functions (for injection into iframe)
 * @returns {string} JavaScript code as string
 */
export function getElementExtractorCode() {
  return `
    function getElementInfo(element) {
      if (!element) return null;
      return {
        tagName: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || null,
        selector: generateSelector(element),
        fullSelector: getFullSelector(element),
        html: element.outerHTML,
        textContent: (element.textContent || '').trim().substring(0, 100) || null,
        attributes: Array.from(element.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {})
      };
    }
  `;
}
