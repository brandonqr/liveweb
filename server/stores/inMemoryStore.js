/**
 * In-memory stores for application state
 */

// Store for active SSE connections
export const sseClients = new Set();

// Store for checkpoints (in-memory for now)
// Structure: Map<pageId, Array<Checkpoint>>
export const checkpointsStore = new Map();
