import { CHART_KEYWORDS, CHART_JS_CDN } from '../config/constants.js';

/**
 * Detect if prompt requests charts/graphs
 * @param {string} prompt - User prompt
 * @returns {boolean} True if charts library is needed
 */
export function needsChartsLibrary(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  return CHART_KEYWORDS.some(keyword => lowerPrompt.includes(keyword));
}

/**
 * Inject Chart.js library into HTML code
 * @param {string} code - HTML code
 * @returns {string} Code with Chart.js injected
 */
export function injectChartJS(code) {
  // Check if Chart.js is already included
  if (code.includes('chart.js') || code.includes('Chart.js') || code.includes('chartjs')) {
    return code;
  }
  
  // Try to inject before </body>
  if (code.includes('</body>')) {
    return code.replace('</body>', `${CHART_JS_CDN}\n</body>`);
  }
  
  // If no </body>, inject before </html>
  if (code.includes('</html>')) {
    return code.replace('</html>', `${CHART_JS_CDN}\n</html>`);
  }
  
  // If no closing tags, append at the end
  return code + '\n' + CHART_JS_CDN;
}
