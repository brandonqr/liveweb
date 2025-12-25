import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { generateCode } from '../services/api'
import { getAPIKeysForPage, hasAPIKey } from '../utils/apiKeysStorage'

/**
 * Custom hook to handle code generation logic
 * Separates generation logic from component
 * 
 * @param {Object} appState - Application state from useAppState
 * @param {Object} logger - Logger instance
 * @param {Function} loadCheckpoints - Function to reload checkpoints
 * @returns {Function} handleVoiceCommand function
 */
export const useCodeGeneration = (appState, logger, loadCheckpoints, setStatus) => {
  const { t } = useTranslation(['app', 'common', 'components', 'errors'])
  const {
    code,
    setCode,
    pageId,
    setPageId,
    checkpointId,
    setCheckpointId,
    selectedComponent,
    setSelectedComponent,
    detectedAPIs,
    setDetectedAPIs,
    apiKeysPanelOpen,
    setApiKeysPanelOpen,
    apiKeysPanelDismissed,
    setApiKeysPanelDismissed,
    isGenerating,
    setIsGenerating
  } = appState

  const handleVoiceCommand = useCallback(async (command) => {
    setIsGenerating(true)
    setStatus(t('app:status.processing', { command }))
    logger.info(`📝 ${t('app:status.processing', { command })}`)

    try {
      // Los logs del backend ahora llegan automáticamente via SSE
      const result = await generateCode(command, code, pageId, null, selectedComponent)
      
      if (result.metadata) {
        logger.info(`⏱️ [Gemini] Tiempo total: ${result.metadata.duration}ms`)
        logger.info(`📊 [Gemini] Tamaño del código: ${result.metadata.cleanedLength} caracteres`)
      }
      
      // Update pageId and checkpointId from response
      if (result.pageId) {
        setPageId(result.pageId)
        // Reset dismissed state cuando cambia de página
        setApiKeysPanelDismissed(false)
      }
      if (result.checkpointId) {
        setCheckpointId(result.checkpointId)
      }
      
      // Handle detected APIs
      if (result.detectedAPIs && result.detectedAPIs.length > 0) {
        setDetectedAPIs(result.detectedAPIs)
        
        // Verificar si hay APIs sin keys configuradas
        const currentPageId = result.pageId || pageId
        if (currentPageId) {
          const apiKeys = getAPIKeysForPage(currentPageId)
          const apisWithoutKeys = result.detectedAPIs.filter(api => !hasAPIKey(currentPageId, api.id))
          
          if (apisWithoutKeys.length > 0) {
            // Hay APIs sin configurar - abrir panel automáticamente si no fue cerrado manualmente
            if (!apiKeysPanelDismissed) {
              setApiKeysPanelOpen(true)
              logger.info(`🔑 [API Keys] ${t('components:apiKeys.apisDetected', { count: apisWithoutKeys.length })}`)
              logger.warning(`⚠️ [API Keys] ${t('components:apiKeys.configureKeys')}`)
            } else {
              logger.info(`🔑 [API Keys] ${t('components:apiKeys.apisDetectedManual', { count: apisWithoutKeys.length })}`)
            }
          } else {
            // Todas las APIs tienen keys configuradas
            logger.success(`✅ [API Keys] ${t('components:apiKeys.apisConfigured')}`)
          }
        }
      } else {
        setDetectedAPIs([])
      }
      
      setCode(result.code)
      setStatus(t('app:status.updated'))
      logger.success(`🎨 [Gemini] ${t('app:messages.codeRendered')}`)
      
      // Clear selection after successful edit
      if (selectedComponent) {
        setSelectedComponent(null)
        logger.info(`📌 ${t('app:messages.componentSelectionCleared')}`)
      }
      
      // Reload checkpoints after generation
      if (result.pageId) {
        setTimeout(() => loadCheckpoints(), 500) // Small delay to ensure backend has saved checkpoint
      }
    } catch (error) {
      console.error('Error generating code:', error)
      const errorMessage = error.message || t('app:messages.errorConnectingGemini')
      logger.error(`❌ [Gemini] ${t('common:error')}: ${errorMessage}`, { error: error.message, stack: error.stack })
      setStatus(t('app:status.error', { message: errorMessage }))
    } finally {
      setIsGenerating(false)
    }
  }, [
    code,
    pageId,
    selectedComponent,
    apiKeysPanelDismissed,
    setIsGenerating,
    setStatus,
    setPageId,
    setCheckpointId,
    setDetectedAPIs,
    setCode,
    setSelectedComponent,
    setApiKeysPanelOpen,
    setApiKeysPanelDismissed,
    logger,
    t,
    loadCheckpoints
  ])

  return { handleVoiceCommand }
}
