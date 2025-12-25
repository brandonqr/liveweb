import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry } from './LogEntry';

/**
 * Logs panel component with auto-scroll and animations
 * @param {Object} props
 * @param {Array} props.logs - Array of log objects
 * @param {Function} props.clearLogs - Function to clear all logs
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {Function} props.onToggle - Function to toggle panel visibility
 */
export const LogsPanel = ({ logs, clearLogs, isOpen = true, onToggle }) => {
  const logsEndRef = useRef(null);
  const logsContainerRef = useRef(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logsEndRef.current && isOpen) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs, isOpen]);

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? '200px' : '0px',
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/30 dark:border-gray-700/30 shadow-lg overflow-hidden z-10"
    >
      {isOpen && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
              <h3 className="text-body-small font-semibold text-gray-700 dark:text-gray-300">
                Progreso
              </h3>
              <motion.span
                key={logs.length}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="badge badge-primary text-caption"
              >
                {logs.length}
              </motion.span>
            </div>
            <div className="flex items-center gap-2">
              {logs.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearLogs}
                  className="px-3 py-1.5 text-caption font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  Limpiar
                </motion.button>
              )}
              {onToggle && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggle}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  {isOpen ? '▼' : '▲'}
                </motion.button>
              )}
            </div>
          </div>

          {/* Logs container */}
          <div
            ref={logsContainerRef}
            className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          >
            {logs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-400 dark:text-gray-500 py-6"
              >
                <p className="text-caption">Listo para procesar comandos</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <LogEntry
                    key={log.id}
                    timestamp={log.timestamp}
                    level={log.level}
                    message={log.message}
                    data={log.data}
                  />
                ))}
              </AnimatePresence>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

