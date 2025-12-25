/**
 * Checkpoint Utilities
 * Pure functions for checkpoint formatting and manipulation
 */

/**
 * Format timestamp to relative time or date
 * @param {number} timestamp - Timestamp in milliseconds
 * @param {Function} t - Translation function
 * @param {string} language - Current language (es/en)
 * @returns {string} Formatted time string
 */
export function formatCheckpointTime(timestamp, t, language = 'en') {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('components:checkpoints.timeAgo.moment');
  if (diffMins < 60) return t('components:checkpoints.timeAgo.minutes', { count: diffMins });
  if (diffHours < 24) return t('components:checkpoints.timeAgo.hours', { count: diffHours });
  if (diffDays < 7) return t('components:checkpoints.timeAgo.days', { count: diffDays });
  
  const locale = language === 'es' ? 'es-ES' : 'en-US';
  return date.toLocaleDateString(locale, { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncate prompt text to max length
 * @param {string} prompt - Prompt text
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncatePrompt(prompt, maxLength = 60) {
  if (!prompt || prompt.length <= maxLength) return prompt || '';
  return prompt.substring(0, maxLength) + '...';
}

/**
 * Sort checkpoints by timestamp (newest first)
 * @param {Array} checkpoints - Array of checkpoints
 * @returns {Array} Sorted checkpoints
 */
export function sortCheckpointsByDate(checkpoints) {
  return [...checkpoints].sort((a, b) => {
    const timeA = a.timestamp || a.createdAt || 0;
    const timeB = b.timestamp || b.createdAt || 0;
    return timeB - timeA;
  });
}
