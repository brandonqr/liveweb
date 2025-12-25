import { useEffect, useRef } from 'react';

/**
 * Custom hook for receiving logs from backend via Server-Sent Events
 * @param {Function} onLog - Callback function to handle received logs
 * @returns {Object} Connection status and control functions
 */
export const useSSELogs = (onLog) => {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const onLogRef = useRef(onLog);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  // Keep the callback ref up to date
  useEffect(() => {
    onLogRef.current = onLog;
  }, [onLog]);

  useEffect(() => {
    // Only connect if onLog callback is provided
    if (!onLog) return;

    const connect = () => {
      try {
        // Close existing connection if any
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const eventSource = new EventSource('http://localhost:3000/api/logs/stream');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          if (import.meta.env.DEV) {
            console.log('✅ SSE connection opened');
          }
          reconnectAttempts.current = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const logData = JSON.parse(event.data);
            // Normalize level to ensure it matches logger methods
            const normalizedLevel = logData.level || 'info';
            // Use the ref to get the latest callback without causing re-renders
            if (onLogRef.current) {
              onLogRef.current(normalizedLevel, logData.message, logData.data);
            }
          } catch (error) {
            if (import.meta.env.DEV) {
              console.error('❌ Error parsing SSE log data:', error, 'Raw data:', event.data);
            }
          }
        };

        eventSource.onerror = (error) => {
          // Only log errors if connection is actually closed
          if (eventSource.readyState === EventSource.CLOSED) {
            if (import.meta.env.DEV) {
              console.error('❌ SSE connection closed');
            }
            eventSource.close();

            // Attempt to reconnect
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current++;
              reconnectTimeoutRef.current = setTimeout(() => {
                if (import.meta.env.DEV) {
                  console.log(`Reconnecting SSE (attempt ${reconnectAttempts.current})...`);
                }
                connect();
              }, reconnectDelay);
            } else {
              if (import.meta.env.DEV) {
                console.error('Max SSE reconnection attempts reached');
              }
            }
          }
        };
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error setting up SSE connection:', error);
        }
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN
  };
};
