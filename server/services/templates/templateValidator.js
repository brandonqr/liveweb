import { validateTemplateStructure } from '../../templates/index.js';
import { sendLogToClients } from '../sseLogs.js';

/**
 * Validate and fix template structure
 * @param {string} code - Generated code
 * @param {Object} matchedTemplate - Matched template
 * @param {boolean} isTemplateBase - Whether this is a template base
 * @returns {string} Fixed code
 */
export function validateAndFixTemplate(code, matchedTemplate, isTemplateBase) {
  if (!isTemplateBase || !matchedTemplate) {
    return code;
  }
  
  const validation = validateTemplateStructure(code, matchedTemplate.id);
  if (!validation.valid) {
    console.warn('⚠️ [Template Validation] Estructura del template no válida:', validation.errors);
    sendLogToClients('warn', `⚠️ [Template] Advertencia: ${validation.errors.join(', ')}`);
    
    // Try to fix common issues
    if (!validation.checks.hasTailwind) {
      console.log('🔧 [Template] Intentando restaurar Tailwind CSS...');
      code = code.replace(
        /<head[^>]*>/i,
        `$&\n  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
      );
    }
    if (!validation.checks.hasMotion) {
      console.log('🔧 [Template] Intentando restaurar Motion...');
      const motionScript = `<script type="module">
    import { animate, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm";
    
    document.addEventListener('DOMContentLoaded', () => {
      // Animations initialized
    });
  </script>`;
      code = code.replace(/<\/head>/i, `${motionScript}\n  </head>`);
    }
  } else {
    console.log('✅ [Template Validation] Estructura del template válida');
    sendLogToClients('success', '✅ [Template] Validación exitosa');
  }
  
  return code;
}
