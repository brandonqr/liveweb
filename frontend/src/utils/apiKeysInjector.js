/**
 * API Keys Injector
 * Inyecta API keys en el código generado antes de renderizarlo
 */

import { getAPIKeysForPage } from './apiKeysStorage.js';

/**
 * Patrones de inyección para cada API
 */
const INJECTION_PATTERNS = {
  mapbox: {
    // Buscar mapboxgl.accessToken = '...' o mapboxgl.accessToken = "..."
    pattern: /mapboxgl\.accessToken\s*=\s*['"][^'"]*['"]/gi,
    // Si no existe, agregar después de la importación de mapbox-gl
    insertAfter: /<script[^>]*mapbox[^>]*>/i,
    template: (key) => `mapboxgl.accessToken = '${key}';`
  },
  googleMaps: {
    pattern: /key\s*=\s*['"][^'"]*['"]/gi,
    insertAfter: /<script[^>]*maps\.googleapis\.com[^>]*>/i,
    template: (key) => `key=${key}`
  },
  openai: {
    pattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    insertAfter: /new OpenAI\(/i,
    template: (key) => `apiKey: '${key}'`
  },
  stripe: {
    pattern: /publishableKey\s*:\s*['"][^'"]*['"]/gi,
    insertAfter: /new Stripe\(/i,
    template: (key) => `publishableKey: '${key}'`
  },
  firebase: {
    pattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    insertAfter: /firebase\.initializeApp/i,
    template: (key) => `apiKey: '${key}'`
  },
  algolia: {
    pattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    insertAfter: /algoliasearch\(/i,
    template: (key) => `apiKey: '${key}'`
  },
  sendgrid: {
    pattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    insertAfter: /sendgrid/i,
    template: (key) => `apiKey: '${key}'`
  },
  twilio: {
    pattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    insertAfter: /twilio/i,
    template: (key) => `apiKey: '${key}'`
  },
  gemini: {
    pattern: /new GoogleGenerativeAI\(['"][^'"]*['"]\)/gi,
    insertAfter: /@google\/genai|GoogleGenerativeAI|gemini/i,
    template: (key) => `new GoogleGenerativeAI('${key}')`
  }
};

/**
 * Inyecta API keys en el código generado
 * @param {string} code - Código HTML original
 * @param {string} pageId - ID de la página
 * @returns {string} Código con las API keys inyectadas
 */
export function injectAPIKeys(code, pageId) {
  if (!code || !pageId) return code;
  
  const apiKeys = getAPIKeysForPage(pageId);
  if (!apiKeys || Object.keys(apiKeys).length === 0) {
    return code;
  }
  
  let injectedCode = code;
  
  for (const [apiId, apiKey] of Object.entries(apiKeys)) {
    if (!apiKey) continue;
    
    const pattern = INJECTION_PATTERNS[apiId];
    if (!pattern) continue;
    
    // Reemplazar placeholders comunes
    const placeholderPatterns = [
      new RegExp(`YOUR_${apiId.toUpperCase()}_API_KEY`, 'gi'),
      new RegExp(`YOUR_${apiId.toUpperCase()}_TOKEN`, 'gi'),
      new RegExp(`YOUR_${apiId.toUpperCase()}_KEY`, 'gi'),
      new RegExp(`\\$\{${apiId}ApiKey\}`, 'gi'),
      new RegExp(`process\\.env\\.${apiId.toUpperCase()}_API_KEY`, 'gi'),
      new RegExp(`process\\.env\\.${apiId.toUpperCase()}_KEY`, 'gi')
    ];
    
    placeholderPatterns.forEach(placeholderPattern => {
      injectedCode = injectedCode.replace(placeholderPattern, apiKey);
    });
    
    // Para Mapbox, manejo especial
    if (apiId === 'mapbox') {
      // Reemplazar si ya existe mapboxgl.accessToken
      if (/mapboxgl\.accessToken\s*=/i.test(injectedCode)) {
        injectedCode = injectedCode.replace(
          /mapboxgl\.accessToken\s*=\s*['"][^'"]*['"]/gi,
          pattern.template(apiKey)
        );
      } else {
        // Buscar script de mapbox-gl y agregar después
        const mapboxScriptMatch = injectedCode.match(/<script[^>]*mapbox[^>]*>/i);
        if (mapboxScriptMatch) {
          const insertPoint = mapboxScriptMatch.index + mapboxScriptMatch[0].length;
          injectedCode = injectedCode.slice(0, insertPoint) + 
            `\n<script>${pattern.template(apiKey)}</script>` +
            injectedCode.slice(insertPoint);
        } else {
          // Agregar al inicio del body o head
          if (injectedCode.includes('</head>')) {
            injectedCode = injectedCode.replace('</head>', `<script>${pattern.template(apiKey)}</script></head>`);
          } else if (injectedCode.includes('<body')) {
            const bodyMatch = injectedCode.match(/<body[^>]*>/i);
            if (bodyMatch) {
              const insertPoint = bodyMatch.index + bodyMatch[0].length;
              injectedCode = injectedCode.slice(0, insertPoint) + 
                `\n<script>${pattern.template(apiKey)}</script>` +
                injectedCode.slice(insertPoint);
            }
          }
        }
      }
    } else if (apiId === 'gemini') {
      // Para Gemini, reemplazar si ya existe GoogleGenerativeAI
      if (/new GoogleGenerativeAI\(['"][^'"]*['"]\)/i.test(injectedCode)) {
        injectedCode = injectedCode.replace(
          /new GoogleGenerativeAI\(['"][^'"]*['"]\)/gi,
          pattern.template(apiKey)
        );
      } else {
        // Buscar referencias a Gemini y agregar la inicialización
        const geminiMatch = injectedCode.match(/(@google\/genai|GoogleGenerativeAI|gemini)/i);
        if (geminiMatch) {
          const insertPoint = geminiMatch.index;
          const initScript = `<script type="module">
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
const genAI = ${pattern.template(apiKey)};
window.genAI = genAI;
</script>`;
          injectedCode = injectedCode.slice(0, insertPoint) + 
            initScript + '\n' +
            injectedCode.slice(insertPoint);
        } else {
          // Agregar al inicio del body o head
          if (injectedCode.includes('</head>')) {
            const geminiScript = `<script type="module">
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
const genAI = ${pattern.template(apiKey)};
window.genAI = genAI;
</script>`;
            injectedCode = injectedCode.replace('</head>', geminiScript + '</head>');
          } else if (injectedCode.includes('<body')) {
            const bodyMatch = injectedCode.match(/<body[^>]*>/i);
            if (bodyMatch) {
              const insertPoint = bodyMatch.index + bodyMatch[0].length;
              const geminiScript = `<script type="module">
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
const genAI = ${pattern.template(apiKey)};
window.genAI = genAI;
</script>`;
              injectedCode = injectedCode.slice(0, insertPoint) + 
                '\n' + geminiScript +
                injectedCode.slice(insertPoint);
            }
          }
        }
      }
    } else {
      // Para otras APIs, usar el patrón de reemplazo
      if (pattern.pattern) {
        injectedCode = injectedCode.replace(pattern.pattern, pattern.template(apiKey));
      }
    }
  }
  
  return injectedCode;
}
