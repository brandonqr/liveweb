import { checkpointsStore } from '../stores/inMemoryStore.js';
import { generateId } from './idGenerator.js';
import { INITIAL_CODE_PLACEHOLDER } from '../config/constants.js';

/**
 * Get or create page ID
 * @param {string} currentCode - Current code content
 * @param {string|null} pageIdFromClient - Page ID provided by client
 * @returns {string} Page ID
 */
export function getPageId(currentCode, pageIdFromClient = null) {
  // If client provides pageId, use it (for incremental edits)
  if (pageIdFromClient && checkpointsStore.has(pageIdFromClient)) {
    return pageIdFromClient;
  }
  
  // If no current code or it's the initial placeholder, create new page
  if (!currentCode || currentCode.trim() === '' || currentCode === INITIAL_CODE_PLACEHOLDER) {
    return generateId();
  }
  
  // Find existing page that contains this code (check latest checkpoint of each page)
  for (const [pageId, checkpoints] of checkpointsStore.entries()) {
    if (checkpoints.length > 0) {
      const latestCheckpoint = checkpoints[checkpoints.length - 1];
      if (latestCheckpoint.code === currentCode) {
        return pageId;
      }
    }
  }
  
  // If not found, it's a new page
  return generateId();
}
