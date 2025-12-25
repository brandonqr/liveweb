/**
 * API Keys Storage Utility
 * Gestiona el almacenamiento de API keys en localStorage
 */

const STORAGE_KEY = 'liveweb_api_keys';

/**
 * Obtiene todas las API keys almacenadas
 * @returns {Object} Estructura: { pageId: { apiId: apiKey } }
 */
export function getAllAPIKeys() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading API keys from localStorage:', error);
    return {};
  }
}

/**
 * Obtiene las API keys para una página específica
 * @param {string} pageId - ID de la página
 * @returns {Object} Objeto con las API keys: { mapbox: 'pk...', googleMaps: 'AIza...' }
 */
export function getAPIKeysForPage(pageId) {
  if (!pageId) return {};
  const allKeys = getAllAPIKeys();
  return allKeys[pageId] || {};
}

/**
 * Obtiene una API key específica para una página
 * @param {string} pageId - ID de la página
 * @param {string} apiId - ID de la API (mapbox, googleMaps, etc.)
 * @returns {string|null} API key o null si no existe
 */
export function getAPIKey(pageId, apiId) {
  if (!pageId || !apiId) return null;
  const pageKeys = getAPIKeysForPage(pageId);
  return pageKeys[apiId] || null;
}

/**
 * Guarda una API key para una página
 * @param {string} pageId - ID de la página
 * @param {string} apiId - ID de la API
 * @param {string} apiKey - API key a guardar
 */
export function saveAPIKey(pageId, apiId, apiKey) {
  if (!pageId || !apiId) return;
  
  const allKeys = getAllAPIKeys();
  if (!allKeys[pageId]) {
    allKeys[pageId] = {};
  }
  
  allKeys[pageId][apiId] = apiKey;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allKeys));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('apiKeysUpdated', { detail: { pageId, apiId } }));
  } catch (error) {
    console.error('Error saving API key to localStorage:', error);
    throw new Error('No se pudo guardar la API key. Verifica que localStorage esté disponible.');
  }
}

/**
 * Elimina una API key específica
 * @param {string} pageId - ID de la página
 * @param {string} apiId - ID de la API
 */
export function deleteAPIKey(pageId, apiId) {
  if (!pageId || !apiId) return;
  
  const allKeys = getAllAPIKeys();
  if (allKeys[pageId] && allKeys[pageId][apiId]) {
    delete allKeys[pageId][apiId];
    
    // Si no quedan keys para esta página, eliminar el objeto
    if (Object.keys(allKeys[pageId]).length === 0) {
      delete allKeys[pageId];
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allKeys));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('apiKeysUpdated', { detail: { pageId, apiId } }));
    } catch (error) {
      console.error('Error deleting API key from localStorage:', error);
    }
  }
}

/**
 * Verifica si una API key está configurada para una página
 * @param {string} pageId - ID de la página
 * @param {string} apiId - ID de la API
 * @returns {boolean} true si está configurada
 */
export function hasAPIKey(pageId, apiId) {
  return getAPIKey(pageId, apiId) !== null;
}
