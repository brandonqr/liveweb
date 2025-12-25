/**
 * Application constants
 */

// Chart.js CDN URL
export const CHART_JS_CDN = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

// Chart keywords for detection
export const CHART_KEYWORDS = [
  'gráfico', 'grafico', 'chart', 'gráfica', 'grafica',
  'barras', 'bar', 'column', 'columna',
  'donut', 'dona', 'pie', 'pastel', 'torta',
  'línea', 'line', 'linea',
  'área', 'area',
  'radar', 'polar'
];

// Initial code placeholder
export const INITIAL_CODE_PLACEHOLDER = '<!-- Di algo para empezar -->';

// Gemini model configuration
export const GEMINI_MODEL = 'gemini-3-flash-preview';
export const GEMINI_TEMPERATURE = 1.0; // Must stay at 1.0 for Gemini 3 (default)
export const GEMINI_MAX_RETRIES = 2;

// Context caching configuration
export const CACHE_MIN_TOKENS = 1024; // Minimum tokens for Gemini 3 Flash caching
export const CACHE_TTL_DEFAULT = 3600; // 1 hour in seconds

// Retry configuration for temporary errors
export const RETRYABLE_STATUS_CODES = [502, 503, 504];
export const RETRY_DELAY_BASE = 1000; // 1 second base delay
