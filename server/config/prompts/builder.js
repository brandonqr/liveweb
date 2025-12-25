/**
 * System Prompt Builder
 * Constructs the complete SYSTEM_PROMPT from all modules
 */
import { BASE_PROMPT } from './base.js';
import { CHARTS_GUIDELINES, MAPBOX_GUIDELINES, GEMINI_GUIDELINES, LIGHTBOX_GUIDELINES } from './guidelines/index.js';
import { EDITING_MODE, COMPONENT_EDITING_MODE, OUTPUT_FORMAT } from './modes.js';

/**
 * Build the complete SYSTEM_PROMPT
 * @returns {string} Complete system prompt
 */
export function buildSystemPrompt() {
  return `${BASE_PROMPT}

${CHARTS_GUIDELINES}

${MAPBOX_GUIDELINES}

${GEMINI_GUIDELINES}

${LIGHTBOX_GUIDELINES}

${EDITING_MODE}

${COMPONENT_EDITING_MODE}

${OUTPUT_FORMAT}`;
}
