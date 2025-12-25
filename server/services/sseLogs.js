import { sseClients } from '../stores/inMemoryStore.js';

/**
 * Send log to all connected SSE clients
 * @param {string} level - Log level (info, warn, error, success)
 * @param {string} message - Log message
 * @param {Object|null} data - Optional data object
 */
export function sendLogToClients(level, message, data = null) {
  const logData = JSON.stringify({
    level,
    message,
    data,
    timestamp: new Date().toISOString()
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📤 Sending SSE log to ${sseClients.size} client(s):`, { level, message: message.substring(0, 50) });
  }
  
  sseClients.forEach(client => {
    try {
      const sseMessage = `data: ${logData}\n\n`;
      client.write(sseMessage);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error sending SSE log:', error);
      }
      // Remove dead connections
      sseClients.delete(client);
    }
  });
}
