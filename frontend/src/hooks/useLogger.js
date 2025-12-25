import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for managing application logs and toast notifications
 * @returns {Object} Logger object with logs array, toasts array, and log functions
 */
export const useLogger = () => {
  const [logs, setLogs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const maxLogs = 100; // Maximum number of logs to keep
  const maxToasts = 5; // Maximum number of visible toasts

  /**
   * Add a new log entry
   * @param {string} level - Log level: 'info', 'success', 'warning', 'error'
   * @param {string} message - Log message
   * @param {any} data - Optional additional data
   */
  const log = useCallback((level, message, data = null) => {
    const newLog = {
      id: Date.now() + Math.random(), // Unique ID for React keys
      timestamp: new Date(),
      level,
      message,
      data
    };

    setLogs(prevLogs => {
      const updatedLogs = [...prevLogs, newLog];
      // Keep only the last maxLogs entries
      return updatedLogs.slice(-maxLogs);
    });
  }, []);

  /**
   * Add a new toast notification
   * @param {string} level - Toast level: 'info', 'success', 'warning', 'error'
   * @param {string} message - Toast message
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  const showToast = useCallback((level, message, duration = 3000) => {
    const newToast = {
      id: Date.now() + Math.random(),
      level,
      message,
      duration
    };

    setToasts(prevToasts => {
      const updatedToasts = [...prevToasts, newToast];
      // Keep only the last maxToasts entries
      return updatedToasts.slice(-maxToasts);
    });
  }, []);

  /**
   * Remove a toast by id
   * @param {string} id - Toast id
   */
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  /**
   * Clear all logs
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  /**
   * Helper functions for different log levels
   * Toasts disabled - using loader for visual feedback instead
   * Using useCallback to prevent recreation on every render
   */
  const info = useCallback((message, data) => {
    log('info', message, data);
    // Toasts disabled - loader provides sufficient feedback
    // if (message.includes('[Gemini]') || message.includes('✅') || message.includes('❌')) {
    //   showToast('info', message, 3000);
    // }
  }, [log]);

  const success = useCallback((message, data) => {
    log('success', message, data);
    // Toasts disabled - loader provides sufficient feedback
    // showToast('success', message, 4000);
  }, [log]);

  const warning = useCallback((message, data) => {
    log('warning', message, data);
    // Toasts disabled - loader provides sufficient feedback
    // showToast('warning', message, 4000);
  }, [log]);

  const error = useCallback((message, data) => {
    log('error', message, data);
    // Toasts disabled - loader provides sufficient feedback
    // showToast('error', message, 5000);
  }, [log]);

  // Return stable logger object
  const logger = {
    logs,
    toasts,
    log,
    showToast,
    removeToast,
    clearLogs,
    info,
    success,
    warning,
    error
  };

  return logger;
};

