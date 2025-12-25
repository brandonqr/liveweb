import { motion } from 'framer-motion';

/**
 * Individual log entry component with animations
 * @param {Object} props
 * @param {Date} props.timestamp - Timestamp of the log
 * @param {string} props.level - Log level: 'info', 'success', 'warning', 'error'
 * @param {string} props.message - Log message
 * @param {any} props.data - Optional additional data
 */
export const LogEntry = ({ timestamp, level, message, data }) => {
  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  // Color classes based on log level with modern gradients and shadows
  const levelStyles = {
    info: 'bg-gradient-to-r from-blue-50/90 to-cyan-50/90 border-l-4 border-blue-500 text-blue-900 dark:from-blue-950/40 dark:to-cyan-950/40 dark:border-blue-400 dark:text-blue-100 shadow-sm shadow-blue-200/50 dark:shadow-blue-900/30',
    success: 'bg-gradient-to-r from-emerald-50/90 to-green-50/90 border-l-4 border-emerald-500 text-emerald-900 dark:from-emerald-950/40 dark:to-green-950/40 dark:border-emerald-400 dark:text-emerald-100 shadow-sm shadow-emerald-200/50 dark:shadow-emerald-900/30',
    warning: 'bg-gradient-to-r from-amber-50/90 to-yellow-50/90 border-l-4 border-amber-500 text-amber-900 dark:from-amber-950/40 dark:to-yellow-950/40 dark:border-amber-400 dark:text-amber-100 shadow-sm shadow-amber-200/50 dark:shadow-amber-900/30',
    error: 'bg-gradient-to-r from-red-50/90 to-rose-50/90 border-l-4 border-red-500 text-red-900 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-400 dark:text-red-100 shadow-sm shadow-red-200/50 dark:shadow-red-900/30'
  };

  // Icon based on level with better visual representation
  const levelIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className={`rounded-lg px-4 py-3 text-sm backdrop-blur-sm ${levelStyles[level] || levelStyles.info}`}
    >
      <div className="flex items-start gap-3">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="text-xl flex-shrink-0"
        >
          {levelIcons[level] || '💡'}
        </motion.span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-caption text-mono font-medium text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-black/30 px-2 py-0.5 rounded">
              {formatTime(timestamp)}
            </span>
            <span className={`badge ${
              level === 'success' ? 'badge-success' :
              level === 'warning' ? 'badge-warning' :
              level === 'error' ? 'badge-error' :
              'badge-primary'
            }`}>
              {level}
            </span>
          </div>
          <div className="text-body-small break-words font-medium leading-relaxed">{message}</div>
          {data && (
            <details className="mt-3">
              <summary className="text-caption cursor-pointer font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Ver detalles
              </summary>
              <motion.pre
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 text-caption text-mono bg-black/10 dark:bg-white/10 p-3 rounded-lg overflow-x-auto border border-gray-200/50 dark:border-gray-700/50"
              >
                {JSON.stringify(data, null, 2)}
              </motion.pre>
            </details>
          )}
        </div>
      </div>
    </motion.div>
  );
};

