import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../../config/index.js';
import { GEMINI_MODEL, CACHE_MIN_TOKENS, CACHE_TTL_DEFAULT } from '../../config/constants.js';

// Initialize Gemini AI client for cache operations
const ai = new GoogleGenAI({ 
  apiKey: GEMINI_API_KEY 
});

// Cache for SYSTEM_PROMPT (reused across all requests)
let systemPromptCache = null;

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 * @param {string} text - Text to estimate
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Create or get cached SYSTEM_PROMPT
 * Context caching reduces costs by ~4x for repeated requests (per context-long.md).
 * Requires minimum 1,024 tokens for Gemini 3 Flash.
 * @param {string} systemPrompt - System prompt to cache
 * @returns {Promise<string|null>} Cache name or null if caching not applicable
 */
export async function getSystemPromptCache(systemPrompt) {
  // Check if SYSTEM_PROMPT is large enough for caching
  const tokenCount = estimateTokens(systemPrompt);
  
  if (tokenCount < CACHE_MIN_TOKENS) {
    return null; // Too small to cache
  }
  
  // If cache already exists, return it
  if (systemPromptCache) {
    return systemPromptCache.name;
  }
  
  try {
    // Create cache for SYSTEM_PROMPT
    const cache = await ai.caches.create({
      model: GEMINI_MODEL,
      config: {
        displayName: 'system-prompt-cache',
        systemInstruction: systemPrompt,
        ttl: `${CACHE_TTL_DEFAULT}s`
      }
    });
    
    systemPromptCache = cache;
    console.log(`✅ [Cache] SYSTEM_PROMPT cacheado exitosamente (${tokenCount} tokens estimados, cache: ${cache.name})`);
    return cache.name;
  } catch (error) {
    console.warn('⚠️ [Cache] Error creando cache para SYSTEM_PROMPT:', error.message);
    return null; // Fallback to non-cached
  }
}

/**
 * Get cached content name for code base (for incremental edits)
 * Caches large code bases to reduce costs when making multiple edits to the same code.
 * @param {string} codeBase - Code base to potentially cache
 * @param {string} pageId - Page ID for cache identification
 * @returns {Promise<string|null>} Cache name or null
 */
export async function getCodeBaseCache(codeBase, pageId) {
  const tokenCount = estimateTokens(codeBase);
  
  if (tokenCount < CACHE_MIN_TOKENS) {
    return null; // Too small to cache
  }
  
  try {
    const cache = await ai.caches.create({
      model: GEMINI_MODEL,
      config: {
        displayName: `code-base-${pageId}`,
        contents: [{ role: 'user', parts: [{ text: codeBase }] }],
        ttl: `${CACHE_TTL_DEFAULT}s`
      }
    });
    
    console.log(`✅ [Cache] Código base para página ${pageId} cacheado exitosamente (${tokenCount} tokens estimados, cache: ${cache.name})`);
    return cache.name;
  } catch (error) {
    console.warn(`⚠️ [Cache] Error creando cache para código base (${pageId}):`, error.message);
    return null;
  }
}

/**
 * Clean up expired caches (optional maintenance function)
 */
export async function cleanupExpiredCaches() {
  try {
    const caches = await ai.caches.list();
    const now = Date.now();
    
    for (const cache of caches) {
      if (cache.expireTime && new Date(cache.expireTime).getTime() < now) {
        await ai.caches.delete(cache.name);
        console.log(`🗑️ [Cache] Cache expirado eliminado: ${cache.name}`);
      }
    }
  } catch (error) {
    console.warn('⚠️ [Cache] Error limpiando caches:', error.message);
  }
}
