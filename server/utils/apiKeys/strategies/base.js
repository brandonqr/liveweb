/**
 * Base API Strategy
 * Abstract base class for all API key strategies
 */
export class APIStrategy {
  constructor(config) {
    if (!config) {
      throw new Error('APIStrategy requires a config object');
    }
    this.name = config.name;
    this.id = config.id;
    this.patterns = config.patterns || [];
    this.placeholder = config.placeholder;
    this.injectionPattern = config.injectionPattern;
    this.injectionTemplate = config.injectionTemplate;
    this.docsUrl = config.docsUrl;
  }

  /**
   * Detect if this API is required in the code
   * @param {string} code - Code to analyze
   * @returns {boolean} True if API is detected
   */
  detect(code) {
    if (!code || typeof code !== 'string') {
      return false;
    }
    return this.patterns.some(pattern => pattern.test(code));
  }

  /**
   * Inject API key into code
   * @param {string} code - Original code
   * @param {string} apiKey - API key to inject
   * @returns {string} Code with API key injected
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

    // Use generic injection pattern if available
    if (this.injectionPattern && this.injectionTemplate) {
      injectedCode = injectedCode.replace(
        this.injectionPattern,
        this.injectionTemplate(apiKey)
      );
    }

    return injectedCode;
  }

  /**
   * Validate API key format (basic validation)
   * @param {string} apiKey - API key to validate
   * @returns {boolean} True if key appears valid
   */
  validate(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    // Basic validation: key should not be empty and not be the placeholder
    return apiKey.trim().length > 0 && apiKey !== this.placeholder;
  }

  /**
   * Get API information for detection result
   * @returns {Object} API information object
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      placeholder: this.placeholder,
      docsUrl: this.docsUrl,
      injectionPattern: this.injectionPattern,
      injectionTemplate: this.injectionTemplate
    };
  }
}
