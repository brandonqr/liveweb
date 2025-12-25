/**
 * Google Gemini API Strategy
 * Handles Gemini-specific detection and injection logic
 */
import { APIStrategy } from './base.js';
import { API_PATTERNS } from '../patterns.js';

export class GeminiStrategy extends APIStrategy {
  constructor() {
    super({
      ...API_PATTERNS.gemini,
      id: 'gemini'
    });
  }

  /**
   * Override inject to handle Gemini-specific injection logic
   * @param {string} code - Original code
   * @param {string} apiKey - Gemini API key
   * @returns {string} Code with Gemini key injected
   */
  inject(code, apiKey) {
    if (!code || !apiKey) {
      return code;
    }

    let injectedCode = code;

    // Replace placeholders
    const placeholderRegex = new RegExp(
      this.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'gi'
    );
    injectedCode = injectedCode.replace(placeholderRegex, apiKey);

    // Check if GoogleGenerativeAI already exists
    if (/new GoogleGenerativeAI\(['"][^'"]*['"]\)/i.test(injectedCode)) {
      // Replace existing initialization
      injectedCode = injectedCode.replace(
        /new GoogleGenerativeAI\(['"][^'"]*['"]\)/gi,
        this.injectionTemplate(apiKey)
      );
    } else {
      // Check for Gemini references
      const geminiMatch = injectedCode.match(/(@google\/genai|GoogleGenerativeAI|gemini)/i);
      if (geminiMatch) {
        // Inject initialization script before usage
        const insertPoint = geminiMatch.index;
        const initScript = this._buildInitScript(apiKey);
        injectedCode = injectedCode.slice(0, insertPoint) +
          initScript + '\n' +
          injectedCode.slice(insertPoint);
      } else {
        // Add to head or body
        const initScript = this._buildInitScript(apiKey);
        injectedCode = this._injectIntoDocument(injectedCode, initScript);
      }
    }

    return injectedCode;
  }

  /**
   * Build the initialization script for Gemini
   * @private
   */
  _buildInitScript(apiKey) {
    return `<script type="module">
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
const genAI = ${this.injectionTemplate(apiKey)};
window.genAI = genAI;
</script>`;
  }

  /**
   * Helper to inject script into document head or body
   * @private
   */
  _injectIntoDocument(code, scriptContent) {
    if (code.includes('</head>')) {
      return code.replace('</head>', scriptContent + '</head>');
    } else if (code.includes('<body')) {
      const bodyMatch = code.match(/<body[^>]*>/i);
      if (bodyMatch) {
        const insertPoint = bodyMatch.index + bodyMatch[0].length;
        return code.slice(0, insertPoint) +
          '\n' + scriptContent +
          code.slice(insertPoint);
      }
    }
    return code;
  }
}
