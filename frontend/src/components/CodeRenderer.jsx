import { useEffect, useRef } from 'react';
import { selectionScript } from '../utils/domSelector/index.js';
import { injectAPIKeys } from '../utils/apiKeysInjector';

/**
 * CodeRenderer component that renders HTML code in a sandboxed iframe
 * @param {string} code - HTML code to render
 * @param {boolean} selectionMode - Whether element selection mode is active
 * @param {Function} onElementSelected - Callback when element is selected
 * @param {string} pageId - Page ID for API keys injection
 */
export const CodeRenderer = ({ code, selectionMode = false, onElementSelected, pageId = null }) => {
  const iframeRef = useRef(null);
  const renderKeyRef = useRef(0);

  // Keyboard shortcut script to inject into iframe
  // This allows 'T' key to work even when iframe has focus
  const keyboardShortcutScript = `
    (function() {
      document.addEventListener('keydown', function(e) {
        // Only handle 'T' key when not in input/textarea and no modifiers
        if (e.key.toLowerCase() === 't' && 
            e.target.tagName !== 'INPUT' && 
            e.target.tagName !== 'TEXTAREA' && 
            !e.target.isContentEditable &&
            !e.ctrlKey && 
            !e.altKey && 
            !e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
          // Send message to parent window
          if (window.parent) {
            window.parent.postMessage({ type: 'KEYBOARD_SHORTCUT', key: 't' }, '*');
          }
        }
      }, true);
    })();
  `;

  // Listen for messages from iframe (keyboard shortcuts, selection, etc.)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeMessage = (event) => {
      // Only process messages from our iframe
      if (event.source !== iframe.contentWindow) return;
      
      // Handle 'T' key press from iframe
      if (event.data.type === 'KEYBOARD_SHORTCUT' && event.data.key === 't') {
        // Dispatch custom event to trigger voice toggle
        window.dispatchEvent(new CustomEvent('voiceToggleRequest'));
      }
      
      // Handle selection script ready
      if (event.data.type === 'SELECTION_SCRIPT_READY' || event.data.type === 'SELECTION_READY') {
        // Script is ready, send selection mode message if needed
        if (selectionMode && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'ENABLE_SELECTION' }, '*');
        }
      }
      
      // Handle element selection
      if (event.data.type === 'ELEMENT_SELECTED' && onElementSelected) {
        onElementSelected(event.data.elementInfo);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [selectionMode, onElementSelected]);

  useEffect(() => {
    if (!iframeRef.current || !code) {
      return;
    }

    try {
      const iframe = iframeRef.current;
      
      // Inject API keys if pageId is provided
      let processedCode = code;
      if (pageId) {
        processedCode = injectAPIKeys(code, pageId);
      }
      
      // Inject selection script and keyboard shortcut handler into the code
      const combinedScript = keyboardShortcutScript + selectionScript;
      
      // Always inject before </body> or at the end if no body tag
      let codeWithScript;
      if (processedCode.includes('</body>')) {
        // Inject before </body> to ensure it runs after DOM is ready
        codeWithScript = processedCode.replace('</body>', `<script>${combinedScript}</script></body>`);
      } else if (processedCode.includes('</html>')) {
        // If no body, inject before </html>
        codeWithScript = processedCode.replace('</html>', `<script>${combinedScript}</script></html>`);
      } else {
        // No closing tags, append at the end
        codeWithScript = processedCode + `<script>${combinedScript}</script>`;
      }
      
      iframe.srcdoc = codeWithScript;
    } catch (error) {
      console.error('Error rendering code in iframe:', error);
    }
  }, [code, pageId]); // Re-render when code or pageId changes

  // Listen for API keys updates to re-render when keys are saved
  useEffect(() => {
    if (!pageId) return;

    const handleAPIKeysUpdate = (e) => {
      if (e.detail?.pageId === pageId && iframeRef.current && code) {
        // Force re-render by updating srcdoc with new keys
        const processedCode = injectAPIKeys(code, pageId);
        const combinedScript = keyboardShortcutScript + selectionScript;
        
        if (processedCode.includes('</body>')) {
          codeWithScript = processedCode.replace('</body>', `<script>${combinedScript}</script></body>`);
        } else if (processedCode.includes('</html>')) {
          codeWithScript = processedCode.replace('</html>', `<script>${combinedScript}</script></html>`);
        } else {
          codeWithScript = processedCode + `<script>${combinedScript}</script>`;
        }
        iframeRef.current.srcdoc = codeWithScript;
      }
    };

    window.addEventListener('apiKeysUpdated', handleAPIKeysUpdate);
    return () => window.removeEventListener('apiKeysUpdated', handleAPIKeysUpdate);
  }, [code, pageId]);

  // Handle selection mode changes
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    let retryCount = 0;
    const maxRetries = 10;
    
    const sendSelectionMessage = () => {
      try {
        if (!iframe.contentWindow) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(sendSelectionMessage, 100);
          }
          return;
        }

        const message = selectionMode
          ? { type: 'ENABLE_SELECTION' }
          : { type: 'DISABLE_SELECTION' };
        
        iframe.contentWindow.postMessage(message, '*');
      } catch (error) {
        console.error('Error sending message to iframe:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(sendSelectionMessage, 100);
        }
      }
    };

    // Initial attempt - wait a bit for iframe to load
    const timer = setTimeout(() => {
      sendSelectionMessage();
    }, 200);

    // Also try when iframe loads
    const handleLoad = () => {
      setTimeout(sendSelectionMessage, 100);
    };
    iframe.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timer);
      iframe.removeEventListener('load', handleLoad);
    };
  }, [selectionMode]);

  return (
    <iframe
      ref={iframeRef}
      title="code-preview"
      sandbox="allow-scripts allow-pointer-lock allow-forms"
      tabIndex={-1}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block'
      }}
    />
  );
};
