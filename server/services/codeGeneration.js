import { GEMINI_API_KEY } from '../config/index.js';
import { GEMINI_MODEL, GEMINI_TEMPERATURE, GEMINI_MAX_RETRIES } from '../config/constants.js';
import { selectThinkingLevel } from './gemini/thinkingLevelSelector.js';
import { SYSTEM_PROMPT } from '../config/prompts/index.js';
import { INITIAL_CODE_PLACEHOLDER } from '../config/constants.js';
import { templates, findTemplateByKeywords } from '../templates/index.js';
import { detectRequiredAPIKeys } from '../utils/apiKeys/index.js';
import { getPageId } from '../utils/pageIdManager.js';
import { createCheckpoint } from './checkpoints.js';
import { sendLogToClients } from './sseLogs.js';
import { generateContentWithRetry } from './gemini/geminiClient.js';
import { buildUserMessage } from './gemini/promptBuilder.js';
import { getSystemPromptCache, getCodeBaseCache } from './gemini/cacheManager.js';
import { handleTemplateApplication, handleMatchedTemplate } from './templates/templateHandler.js';
import { validateAndFixTemplate } from './templates/templateValidator.js';
import { cleanGeneratedCode } from './codeProcessing/codeCleaner.js';
import { enhanceCode } from './codeProcessing/codeEnhancer.js';
import { handleGenerationError } from './errors/generationErrorHandler.js';

/**
 * Generate code using Gemini AI
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Generated code and metadata
 */
export async function generateCode(params) {
  const { prompt, currentCode, pageId, templateId, selectedComponent } = params;
  
  // Validate request
  if (!prompt) {
    throw new Error('Missing required field: prompt');
  }
  
  // Check API key
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  
  // Check if template is requested
  if (templateId && templates[templateId]) {
    return handleTemplateApplication(templateId, templates[templateId]);
  }
  
  // Check if prompt matches a template keyword
  const matchedTemplate = findTemplateByKeywords(prompt);
  let finalCurrentCode = currentCode;
  
  if (matchedTemplate) {
    const templateResult = handleMatchedTemplate(matchedTemplate, prompt, currentCode);
    if (templateResult) {
      return templateResult;
    }
    
    // Use template code as currentCode for personalization
    if (!currentCode || currentCode.trim() === '' || currentCode === INITIAL_CODE_PLACEHOLDER) {
      finalCurrentCode = matchedTemplate.code;
    }
  }
  
  // Log: Inicio del proceso
  sendLogToClients('info', '📝 [Gemini] Iniciando generación de código...');
  const promptPreview = prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '');
  sendLogToClients('info', `📝 [Gemini] Prompt recibido: ${promptPreview}`);
  
  // Build user message
  const { userMessage, isTemplateBase } = buildUserMessage({
    prompt,
    currentCode: finalCurrentCode,
    selectedComponent,
    matchedTemplate
  });
  
  // Log mode
  if (finalCurrentCode && finalCurrentCode.trim() !== '' && finalCurrentCode !== INITIAL_CODE_PLACEHOLDER) {
    sendLogToClients('info', '📝 [Gemini] Modo: Modificación incremental (código existente detectado)');
    const codeSize = finalCurrentCode.length;
    sendLogToClients('info', `📊 [Gemini] Código existente: ${codeSize} caracteres`, {
      size: codeSize,
      preview: finalCurrentCode.substring(0, 200) + '...'
    });
  } else {
    sendLogToClients('info', '📝 [Gemini] Modo: Generación nueva (sin código previo)');
  }
  
  if (selectedComponent) {
    sendLogToClients('info', `📌 [Component] Editando componente seleccionado: ${selectedComponent.tagName} (${selectedComponent.selector})`);
  }
  
  // Log message construction
  const messageLength = `${SYSTEM_PROMPT}\n\n${userMessage}`.length;
  sendLogToClients('info', `📝 [Gemini] Mensaje construido (${messageLength} caracteres)`, {
    totalLength: messageLength,
    hasContext: !!finalCurrentCode && finalCurrentCode.trim() !== '' && finalCurrentCode !== INITIAL_CODE_PLACEHOLDER
  });
  
  // Determine optimal thinking level based on task complexity
  const thinkingLevel = selectThinkingLevel({
    prompt,
    currentCode: finalCurrentCode,
    selectedComponent
  });
  
  // Try to get cached SYSTEM_PROMPT (prepared for future use)
  const cachedContent = await getSystemPromptCache(SYSTEM_PROMPT);
  
  // Prepare config with thinking level
  const config = {
    thinkingConfig: {
      thinkingLevel: thinkingLevel
    },
    temperature: GEMINI_TEMPERATURE
  };
  
  // Add cached content if available (for future use)
  if (cachedContent) {
    config.cachedContent = cachedContent;
    sendLogToClients('info', '💾 [Cache] Usando SYSTEM_PROMPT cacheado para reducir costos');
  }
  
  // Generate content with Gemini
  sendLogToClients('info', `📝 [Gemini] Configurando llamada a Gemini 3 Flash (thinkingLevel: ${thinkingLevel}, temperature: 1.0)`);
  sendLogToClients('info', '📝 [Gemini] Enviando request a Gemini API...');
  const startTime = Date.now();
  
  // Build contents: if cached, only send user message; otherwise send full prompt
  const contents = cachedContent 
    ? [{ role: "user", parts: [{ text: userMessage }] }]
    : [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${userMessage}` }] }];
  
  const response = await generateContentWithRetry({
    model: GEMINI_MODEL,
    contents: contents,
    config: config
  }, GEMINI_MAX_RETRIES);
  
  const duration = Date.now() - startTime;
  sendLogToClients('info', `📝 [Gemini] Respuesta recibida en ${duration}ms`, { duration });
  
  // Extract and clean generated code
  const generatedCode = response.text;
  sendLogToClients('info', `📝 [Gemini] Código generado (${generatedCode.length} caracteres)`, {
    length: generatedCode.length,
    preview: generatedCode.substring(0, 100) + '...'
  });
  
  sendLogToClients('info', '🧹 [Gemini] Limpiando código (removiendo markdown)...');
  let cleanCode = cleanGeneratedCode(generatedCode);
  
  // Enhance code with additional libraries if needed
  cleanCode = enhanceCode(cleanCode, prompt);
  
  // Validate and fix template structure
  cleanCode = validateAndFixTemplate(cleanCode, matchedTemplate, isTemplateBase);
  
  sendLogToClients('info', `📝 [Gemini] Código limpiado (${cleanCode.length} caracteres, removidos ${generatedCode.length - cleanCode.length})`, {
    originalLength: generatedCode.length,
    cleanedLength: cleanCode.length,
    removed: generatedCode.length - cleanCode.length
  });
  
  sendLogToClients('success', '✅ [Gemini] Proceso completado exitosamente');
  
  // Detect required API keys
  const detectedAPIs = detectRequiredAPIKeys(cleanCode);
  if (detectedAPIs.length > 0) {
    sendLogToClients('info', `🔑 [API Keys] Detectadas ${detectedAPIs.length} API(s) que requieren configuración: ${detectedAPIs.map(api => api.name).join(', ')}`);
  }
  
  // Create checkpoint
  const currentPageId = getPageId(finalCurrentCode, pageId);
  const checkpoint = createCheckpoint(currentPageId, prompt, cleanCode);
  
  console.log(`📌 [Checkpoint] Creado checkpoint ${checkpoint.id} para página ${currentPageId}`);
  sendLogToClients('info', `📌 [Checkpoint] Versión guardada: ${checkpoint.id.substring(0, 8)}...`);
  
  return {
    code: cleanCode,
    success: true,
    pageId: currentPageId,
    checkpointId: checkpoint.id,
    detectedAPIs,
    metadata: {
      duration,
      originalLength: generatedCode.length,
      cleanedLength: cleanCode.length
    }
  };
}

// Re-export error handler for routes
export { handleGenerationError };
