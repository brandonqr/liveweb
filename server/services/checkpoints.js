import { checkpointsStore } from '../stores/inMemoryStore.js';
import { generateId } from '../utils/idGenerator.js';

/**
 * Create a checkpoint for a page
 * @param {string} pageId - Page ID
 * @param {string} prompt - User prompt
 * @param {string} code - Generated code
 * @returns {Object} Created checkpoint
 */
export function createCheckpoint(pageId, prompt, code) {
  if (!checkpointsStore.has(pageId)) {
    checkpointsStore.set(pageId, []);
  }
  
  const checkpoints = checkpointsStore.get(pageId);
  
  // Mark all previous checkpoints as inactive
  checkpoints.forEach(cp => cp.isActive = false);
  
  const checkpoint = {
    id: generateId(),
    pageId,
    timestamp: new Date(),
    prompt,
    code,
    isActive: true
  };
  
  checkpoints.push(checkpoint);
  return checkpoint;
}

/**
 * Get all checkpoints for a page
 * @param {string} pageId - Page ID
 * @returns {Array} Array of checkpoints (without code)
 */
export function getCheckpoints(pageId) {
  if (!checkpointsStore.has(pageId)) {
    return [];
  }
  
  return checkpointsStore.get(pageId).map(cp => ({
    id: cp.id,
    pageId: cp.pageId,
    timestamp: cp.timestamp,
    prompt: cp.prompt,
    isActive: cp.isActive
  }));
}

/**
 * Get a specific checkpoint by ID
 * @param {string} pageId - Page ID
 * @param {string} checkpointId - Checkpoint ID
 * @returns {Object|null} Checkpoint or null if not found
 */
export function getCheckpoint(pageId, checkpointId) {
  if (!checkpointsStore.has(pageId)) {
    return null;
  }
  
  const checkpoints = checkpointsStore.get(pageId);
  const checkpoint = checkpoints.find(cp => cp.id === checkpointId);
  
  if (!checkpoint) {
    return null;
  }
  
  // Mark this checkpoint as active and others as inactive
  checkpoints.forEach(cp => {
    cp.isActive = cp.id === checkpointId;
  });
  
  return {
    code: checkpoint.code,
    checkpoint: {
      id: checkpoint.id,
      pageId: checkpoint.pageId,
      timestamp: checkpoint.timestamp,
      prompt: checkpoint.prompt,
      isActive: checkpoint.isActive
    }
  };
}
