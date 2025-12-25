import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Custom hook to manage panel state and operations
 * Centralizes panel open/close logic
 * 
 * @param {Object} appState - Application state from useAppState
 * @param {Object} logger - Logger instance
 * @returns {Object} Panel management functions
 */
export const usePanelManagement = (appState, logger) => {
  const { t } = useTranslation(['app'])
  const {
    checkpointsPanelOpen,
    setCheckpointsPanelOpen,
    templatesPanelOpen,
    setTemplatesPanelOpen,
    apiKeysPanelOpen,
    setApiKeysPanelOpen,
    apiKeysPanelDismissed,
    setApiKeysPanelDismissed,
    selectionMode,
    setSelectionMode,
    selectedComponent,
    setSelectedComponent
  } = appState

  const openTemplatesPanel = useCallback(() => {
    setTemplatesPanelOpen(true)
  }, [setTemplatesPanelOpen])

  const closeTemplatesPanel = useCallback(() => {
    setTemplatesPanelOpen(false)
  }, [setTemplatesPanelOpen])

  const toggleTemplatesPanel = useCallback(() => {
    setTemplatesPanelOpen(prev => !prev)
  }, [setTemplatesPanelOpen])

  const openCheckpointsPanel = useCallback(() => {
    setCheckpointsPanelOpen(true)
  }, [setCheckpointsPanelOpen])

  const closeCheckpointsPanel = useCallback(() => {
    setCheckpointsPanelOpen(false)
  }, [setCheckpointsPanelOpen])

  const toggleCheckpointsPanel = useCallback(() => {
    setCheckpointsPanelOpen(prev => !prev)
  }, [setCheckpointsPanelOpen])

  const openApiKeysPanel = useCallback(() => {
    setApiKeysPanelOpen(true)
    setApiKeysPanelDismissed(false) // Reset cuando se abre manualmente
  }, [setApiKeysPanelOpen, setApiKeysPanelDismissed])

  const closeApiKeysPanel = useCallback(() => {
    setApiKeysPanelOpen(false)
    setApiKeysPanelDismissed(true) // Recordar que el usuario cerró el panel
  }, [setApiKeysPanelOpen, setApiKeysPanelDismissed])

  const toggleApiKeysPanel = useCallback(() => {
    setApiKeysPanelOpen(prev => {
      if (!prev) {
        setApiKeysPanelDismissed(false) // Reset cuando se abre manualmente
      }
      return !prev
    })
  }, [setApiKeysPanelOpen, setApiKeysPanelDismissed])

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(prev => {
      if (prev) {
        setSelectedComponent(null)
      }
      return !prev
    })
  }, [setSelectionMode, setSelectedComponent])

  return {
    // Templates
    templatesPanelOpen,
    openTemplatesPanel,
    closeTemplatesPanel,
    toggleTemplatesPanel,
    
    // Checkpoints
    checkpointsPanelOpen,
    openCheckpointsPanel,
    closeCheckpointsPanel,
    toggleCheckpointsPanel,
    
    // API Keys
    apiKeysPanelOpen,
    apiKeysPanelDismissed,
    openApiKeysPanel,
    closeApiKeysPanel,
    toggleApiKeysPanel,
    
    // Selection
    selectionMode,
    toggleSelectionMode
  }
}
