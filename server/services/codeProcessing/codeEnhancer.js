import { needsChartsLibrary, injectChartJS } from '../../utils/codeInjector.js';
import { sendLogToClients } from '../sseLogs.js';

/**
 * Enhance code with additional libraries if needed
 * @param {string} code - Generated code
 * @param {string} prompt - User prompt
 * @returns {string} Enhanced code
 */
export function enhanceCode(code, prompt) {
  // Check if charts library is needed and inject it
  if (needsChartsLibrary(prompt)) {
    sendLogToClients('info', '📊 [Charts] Detectada solicitud de gráficos, inyectando Chart.js...');
    return injectChartJS(code);
  }
  
  return code;
}
