import { INITIAL_CODE_PLACEHOLDER } from '../../config/constants.js';

/**
 * Build prompt for component editing
 * @param {string} prompt - User prompt
 * @param {string} currentCode - Current code
 * @param {Object} selectedComponent - Selected component info
 * @returns {string} User message
 */
function buildComponentEditPrompt(prompt, currentCode, selectedComponent) {
  // Gemini 3 best practice: Context first, instructions at the end
  return `<context>
Código HTML existente (PRESERVAR todo lo que no se modifique explícitamente):
${currentCode}
</context>

<selected_component>
El usuario ha seleccionado el siguiente componente para editar:
- Tag: ${selectedComponent.tagName}
- Selector: ${selectedComponent.selector}
- Selector completo: ${selectedComponent.fullSelector}
- HTML actual del componente:
${selectedComponent.html}
- Texto visible: ${selectedComponent.textContent || 'N/A'}
- Atributos: ${JSON.stringify(selectedComponent.attributes)}
</selected_component>

<task>
Basándote ÚNICAMENTE en el código HTML proporcionado arriba, realiza la siguiente modificación:

${prompt}

REGLAS CRÍTICAS PARA ESTA EDICIÓN DE COMPONENTE:
1. MODIFICA ÚNICAMENTE el componente seleccionado identificado por el selector: ${selectedComponent.selector}
2. PRESERVA todo el resto del código HTML sin cambios
3. Reemplaza SOLO el HTML del componente seleccionado con la versión modificada
4. Mantén la estructura y atributos del elemento a menos que se solicite cambiarlos
5. El código generado debe contener el componente modificado en su contexto original
6. NO modifiques otros elementos, solo el componente seleccionado

Devuelve el código HTML COMPLETO con el componente seleccionado modificado, preservando todo lo demás exactamente igual.
</task>`;
}

/**
 * Build prompt for template personalization
 * @param {string} prompt - User prompt
 * @param {string} currentCode - Current code (template)
 * @returns {string} User message
 */
function buildTemplatePersonalizationPrompt(prompt, currentCode) {
  // Gemini 3 best practice: Large context first, specific instructions at the end
  return `<context>
Template base proporcionado (usa como punto de partida y personaliza según la solicitud):
${currentCode}
</context>

<task>
Basándote en el template base proporcionado arriba, personaliza según los siguientes requisitos:

${prompt}

REGLAS CRÍTICAS PARA PERSONALIZACIÓN:
1. MANTÉN la estructura general y el diseño del template base
2. PERSONALIZA el contenido, textos, datos y funcionalidad según la solicitud específica
3. ADAPTA los elementos visuales (colores, estilos) si es necesario para el contexto
4. MODIFICA los datos de ejemplo para que sean relevantes al caso de uso
5. PRESERVA la funcionalidad base pero adáptala a los requisitos específicos
6. Si se menciona un tema específico (ej: "equipos de ordenadores"), personaliza completamente el contenido para ese tema

IMPORTANTE - CONFIGURACIÓN DEL TEMPLATE:
- El template base YA INCLUYE Tailwind CSS 4 vía CDN: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
- El template base YA INCLUYE Motion (animaciones) vía CDN: <script type="module">import { animate, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm";</script>
- NO dupliques estos scripts, el template ya los tiene configurados
- USA las clases de Tailwind CSS 4 para estilos (bg-slate-50, text-xl, rounded-xl, etc.)
- USA Motion para animaciones cuando sea apropiado (animate, scroll, stagger)
- MANTÉN la estructura de scripts del template base

Devuelve el código HTML COMPLETO personalizado según la solicitud, manteniendo la estructura base del template y sus librerías configuradas.
</task>`;
}

/**
 * Build prompt for incremental editing
 * @param {string} prompt - User prompt
 * @param {string} currentCode - Current code
 * @returns {string} User message
 */
function buildIncrementalEditPrompt(prompt, currentCode) {
  // Gemini 3 best practice: Context first, then anchor phrase, then specific instruction
  return `<context>
Código HTML existente (PRESERVAR todo lo que no se modifique explícitamente):
${currentCode}
</context>

<task>
Basándote ÚNICAMENTE en el código HTML proporcionado arriba, realiza la siguiente modificación:

${prompt}

REGLAS CRÍTICAS PARA ESTA EDICIÓN:
1. PRESERVA todo el código existente que NO está relacionado con la modificación solicitada
2. MODIFICA SOLO las partes específicamente mencionadas en la solicitud
3. NO reescribas secciones completas si solo se necesita un cambio menor
4. MANTÉN la estructura, estilos y funcionalidad existente intacta
5. Si agregas algo nuevo, hazlo sin modificar el código existente innecesariamente
6. El objetivo es generar el MÍNIMO código necesario para la modificación

Devuelve el código HTML COMPLETO con la modificación aplicada, preservando todo lo demás.
</task>`;
}

/**
 * Build prompt for new code generation
 * @param {string} prompt - User prompt
 * @returns {string} User message
 */
function buildNewCodePrompt(prompt) {
  return `<task>
${prompt}

Genera una aplicación web completa en un solo archivo HTML.

REGLAS CRÍTICAS DE JAVASCRIPT:
- Define TODAS las funciones ANTES de usarlas en onclick o event listeners
- Usa DOMContentLoaded para código que necesita el DOM cargado
- NUNCA uses "import" statements fuera de <script type="module">
- Para Mapbox: usa CDN con <script src="...">, NO uses import
- Si usas onclick en HTML, asegúrate de que la función esté definida en un script ANTERIOR
</task>`;
}

/**
 * Build user message for code generation
 * @param {Object} params - Parameters
 * @param {string} params.prompt - User prompt
 * @param {string} params.currentCode - Current code
 * @param {Object} params.selectedComponent - Selected component info
 * @param {Object} params.matchedTemplate - Matched template
 * @returns {Object} { userMessage, isTemplateBase }
 */
export function buildUserMessage({ prompt, currentCode, selectedComponent, matchedTemplate }) {
  let userMessage;
  let isTemplateBase = false;
  
  // Check if we're using a template as base
  if (matchedTemplate && currentCode === matchedTemplate.code) {
    isTemplateBase = true;
  }
  
  if (currentCode && currentCode.trim() !== '' && currentCode !== INITIAL_CODE_PLACEHOLDER) {
    // Check if editing a specific component
    if (selectedComponent) {
      userMessage = buildComponentEditPrompt(prompt, currentCode, selectedComponent);
    } else if (isTemplateBase) {
      // Personalizing a template with specific requirements
      userMessage = buildTemplatePersonalizationPrompt(prompt, currentCode);
    } else {
      // Use completion strategy: provide full context, then specific instruction
      userMessage = buildIncrementalEditPrompt(prompt, currentCode);
    }
  } else {
    // For new code generation: direct instruction
    userMessage = buildNewCodePrompt(prompt);
  }
  
  return { userMessage, isTemplateBase };
}
