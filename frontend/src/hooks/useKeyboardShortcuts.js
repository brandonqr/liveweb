import { useEffect, useRef } from 'react'

/**
 * Custom hook to handle keyboard shortcuts
 * Currently handles 'T' key for microphone toggle
 * 
 * @param {Function} toggleListening - Function to toggle voice recognition
 * @param {boolean} isGenerating - Whether code is being generated (disables shortcut)
 */
export const useKeyboardShortcuts = (toggleListening, isGenerating) => {
  const toggleListeningRef = useRef(toggleListening)

  // Keep toggleListening ref up to date
  useEffect(() => {
    toggleListeningRef.current = toggleListening
  }, [toggleListening])

  // Handle keyboard shortcut (T key) for microphone toggle
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only trigger if:
      // 1. Key is 't' or 'T'
      // 2. Not typing in an input/textarea field
      // 3. Not holding modifier keys (Ctrl, Alt, Meta)
      // 4. Not currently generating code
      const isInputField = event.target.tagName === 'INPUT' || 
                          event.target.tagName === 'TEXTAREA' || 
                          event.target.isContentEditable
      
      // Check if event is from iframe (iframe content has different document/window)
      // Events from iframe won't reach window listener, so we need to handle them differently
      const isFromIframe = event.target && 
                          event.target.ownerDocument && 
                          event.target.ownerDocument !== document
      
      if (event.key.toLowerCase() === 't' && 
          !isInputField && 
          !isFromIframe &&
          !event.ctrlKey && 
          !event.altKey && 
          !event.metaKey &&
          !isGenerating) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        
        // Use ref to get the latest toggleListening function
        const currentToggle = toggleListeningRef.current
        if (currentToggle && typeof currentToggle === 'function') {
          try {
            currentToggle()
          } catch (error) {
            console.error('Error toggling listening:', error)
          }
        } else {
          console.warn('toggleListening is not a function:', typeof currentToggle, currentToggle)
        }
      }
    }

    // Add listener to window with capture phase to catch events early
    // This should work even when iframe has focus (events bubble to window)
    window.addEventListener('keydown', handleKeyPress, true)
    
    // Also add to document as fallback
    document.addEventListener('keydown', handleKeyPress, true)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress, true)
      document.removeEventListener('keydown', handleKeyPress, true)
    }
  }, [isGenerating])
}
