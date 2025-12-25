/**
 * Mapbox API Strategy
 * Handles Mapbox-specific detection and injection logic
 */
import { APIStrategy } from './base.js';
import { API_PATTERNS } from '../patterns.js';

export class MapboxStrategy extends APIStrategy {
  constructor() {
    super({
      ...API_PATTERNS.mapbox,
      id: 'mapbox'
    });
  }

  /**
   * Override inject to handle Mapbox-specific injection logic
   * @param {string} code - Original code
   * @param {string} apiKey - Mapbox API key
   * @returns {string} Code with Mapbox key injected
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

    // Check if mapboxgl.accessToken already exists
    if (/mapboxgl\.accessToken\s*=/i.test(injectedCode)) {
      // Replace existing token
      injectedCode = injectedCode.replace(
        /mapboxgl\.accessToken\s*=\s*['"][^'"]*['"]/gi,
        this.injectionTemplate(apiKey)
      );
    } else {
      // Inject new token after mapbox import
      const mapboxImportMatch = injectedCode.match(/<script[^>]*mapbox[^>]*>/i);
      if (mapboxImportMatch) {
        const insertPoint = mapboxImportMatch.index + mapboxImportMatch[0].length;
        injectedCode = injectedCode.slice(0, insertPoint) +
          `\n<script>${this.injectionTemplate(apiKey)}</script>` +
          injectedCode.slice(insertPoint);
      } else {
        // Add to head or body
        injectedCode = this._injectIntoDocument(injectedCode, this.injectionTemplate(apiKey));
      }
    }

    return injectedCode;
  }

  /**
   * Helper to inject script into document head or body
   * @private
   */
  _injectIntoDocument(code, scriptContent) {
    if (code.includes('</head>')) {
      return code.replace('</head>', `<script>${scriptContent}</script></head>`);
    } else if (code.includes('<body')) {
      const bodyMatch = code.match(/<body[^>]*>/i);
      if (bodyMatch) {
        const insertPoint = bodyMatch.index + bodyMatch[0].length;
        return code.slice(0, insertPoint) +
          `\n<script>${scriptContent}</script>` +
          code.slice(insertPoint);
      }
    }
    return code;
  }
}
