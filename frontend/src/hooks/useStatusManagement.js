import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Custom hook to manage application status
 * Handles status updates based on app state and i18n
 * 
 * @param {boolean} isGenerating - Whether code is being generated
 * @param {boolean} isListening - Whether voice recognition is active
 * @param {string} transcript - Current voice transcript
 * @param {string} speechError - Speech recognition error
 * @returns {string} Current status
 */
export const useStatusManagement = (isGenerating, isListening, transcript, speechError) => {
  const { t, i18n, ready } = useTranslation(['app', 'errors'])
  const [status, setStatus] = useState('')

  // Initialize status with translation
  useEffect(() => {
    if (ready) {
      setStatus(t('app:status.ready'))
    }
  }, [t, ready])
  
  // Update status when language changes
  useEffect(() => {
    if (ready && !isGenerating && !isListening && !transcript && status) {
      setStatus(t('app:status.ready'))
    }
  }, [i18n.language, t, ready, isGenerating, isListening, transcript, status])

  // Update status based on listening state
  useEffect(() => {
    if (isGenerating) {
      // Status is already set in handleVoiceCommand
      return
    }
    
    if (isListening) {
      setStatus(t('app:status.listening'))
    } else if (speechError) {
      setStatus(t('errors:voiceRecognition', { error: speechError }))
    } else if (!isGenerating) {
      // Only reset to 'Ready' if not generating
      if (status !== t('app:status.updated') && !transcript) {
        setStatus(t('app:status.ready'))
      }
    }
  }, [isListening, speechError, isGenerating, status, transcript, t])

  return { status, setStatus, ready }
}
