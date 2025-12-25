import { getPageId } from '../../utils/pageIdManager.js';
import { createCheckpoint } from '../checkpoints.js';
import { sendLogToClients } from '../sseLogs.js';
import { detectRequiredAPIKeys } from '../../utils/apiKeys/index.js';
import { INITIAL_CODE_PLACEHOLDER } from '../../config/constants.js';
import { hasSpecificRequirements } from './templateMatcher.js';

/**
 * Handle template application
 * @param {string} templateId - Template ID
 * @param {Object} template - Template object
 * @returns {Object} Response data
 */
export function handleTemplateApplication(templateId, template) {
  const currentPageId = getPageId('', null);
  const checkpoint = createCheckpoint(currentPageId, `Template: ${template.name}`, template.code);
  
  console.log(`📌 [Template] Aplicado template ${templateId} para página ${currentPageId}`);
  sendLogToClients('info', `📌 [Template] Template "${template.name}" aplicado`);
  
  // Detect required API keys in template
  const templateDetectedAPIs = detectRequiredAPIKeys(template.code);
  
  return {
    code: template.code,
    success: true,
    pageId: currentPageId,
    checkpointId: checkpoint.id,
    isTemplate: true,
    templateName: template.name,
    detectedAPIs: templateDetectedAPIs,
    metadata: {
      duration: 0,
      originalLength: template.code.length,
      cleanedLength: template.code.length
    }
  };
}

/**
 * Handle matched template (direct or personalized)
 * @param {Object} matchedTemplate - Matched template
 * @param {string} prompt - User prompt
 * @param {string} currentCode - Current code
 * @returns {Object|null} Response data or null if should continue with Gemini
 */
export function handleMatchedTemplate(matchedTemplate, prompt, currentCode) {
  if (currentCode && currentCode.trim() !== '' && currentCode !== INITIAL_CODE_PLACEHOLDER) {
    return null; // Continue with Gemini
  }
  
  const hasSpecific = hasSpecificRequirements(prompt, matchedTemplate);
  
  if (hasSpecific) {
    // Use template as base but personalize with Gemini
    console.log(`📌 [Template] Template "${matchedTemplate.name}" detectado, personalizando con Gemini...`);
    sendLogToClients('info', `📌 [Template] Template "${matchedTemplate.name}" detectado, personalizando según solicitud...`);
    return null; // Continue with Gemini, but use template code as currentCode
  } else {
    // Generic request, use template directly
    const currentPageId = getPageId('', null);
    const checkpoint = createCheckpoint(currentPageId, `Template detectado: ${matchedTemplate.name}`, matchedTemplate.code);
    
    console.log(`📌 [Template] Template detectado automáticamente: ${matchedTemplate.id}`);
    sendLogToClients('info', `📌 [Template] Template "${matchedTemplate.name}" detectado y aplicado`);
    
    // Detect required API keys in matched template
    const matchedTemplateDetectedAPIs = detectRequiredAPIKeys(matchedTemplate.code);
    
    return {
      code: matchedTemplate.code,
      success: true,
      pageId: currentPageId,
      checkpointId: checkpoint.id,
      isTemplate: true,
      templateName: matchedTemplate.name,
      detectedAPIs: matchedTemplateDetectedAPIs,
      metadata: {
        duration: 0,
        originalLength: matchedTemplate.code.length,
        cleanedLength: matchedTemplate.code.length
      }
    };
  }
}
