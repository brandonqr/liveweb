import { useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useLogger } from './hooks/useLogger'
import { useSSELogs } from './hooks/useSSELogs'
import { useAppState } from './hooks/useAppState'
import { useStatusManagement } from './hooks/useStatusManagement'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useCodeGeneration } from './hooks/useCodeGeneration'
import { usePanelManagement } from './hooks/usePanelManagement'
import { AppHeader } from './components/AppHeader'
import { AppContent } from './components/AppContent'
import { AppFooter } from './components/AppFooter'
import { CheckpointsPanel } from './components/CheckpointsPanel/index.jsx'
import { TemplatesPanel } from './components/TemplatesPanel'
import { APIKeysConfig } from './components/APIKeysConfig/index.jsx'
import { getCheckpoints, getTemplates } from './services/api'

function App() {
  const { t, ready } = useTranslation(['app', 'common', 'components', 'errors'])
  
  // Custom hooks
  const appState = useAppState()
  const logger = useLogger()
  const { isListening, transcript, error: speechError, toggleListening, isSupported } = useSpeechRecognition('es-ES')
  const { status, setStatus, ready: i18nReady } = useStatusManagement(
    appState.isGenerating,
    isListening,
    transcript,
    speechError
  )
  
  // Refs for callbacks
  const loggerRef = useRef(logger)
  const toggleListeningRef = useRef(toggleListening)
  const lastTranscriptRef = useRef('')
  
  // Keep refs up to date
  useEffect(() => {
    loggerRef.current = logger
  }, [logger])
  
  useEffect(() => {
    toggleListeningRef.current = toggleListening
  }, [toggleListening])
  
  // Connect to SSE for real-time backend logs
  const handleSSELogRef = useRef((level, message, data) => {
    const currentLogger = loggerRef.current
    if (currentLogger[level] && typeof currentLogger[level] === 'function') {
      currentLogger[level](message, data)
    } else {
      currentLogger.info(message, data)
    }
  })
  
  useSSELogs(handleSSELogRef.current)
  
  // Keyboard shortcuts
  useKeyboardShortcuts(toggleListening, appState.isGenerating)
  
  // Listen for voice toggle requests from iframe
  useEffect(() => {
    const handleVoiceToggleRequest = () => {
      if (isSupported && toggleListeningRef.current && !appState.isGenerating) {
        toggleListeningRef.current()
      }
    };
    
    window.addEventListener('voiceToggleRequest', handleVoiceToggleRequest)
    return () => window.removeEventListener('voiceToggleRequest', handleVoiceToggleRequest)
  }, [isSupported, appState.isGenerating])
  
  // Load checkpoints when pageId changes
  const loadCheckpoints = useCallback(async () => {
    if (!appState.pageId) return
    try {
      const data = await getCheckpoints(appState.pageId)
      appState.setCheckpoints(data.checkpoints || [])
    } catch (error) {
      console.error('Error loading checkpoints:', error)
    }
  }, [appState.pageId, appState.setCheckpoints])
  
  useEffect(() => {
    if (appState.pageId) {
      loadCheckpoints()
    }
  }, [appState.pageId, loadCheckpoints])
  
  // Load templates on mount
  const loadTemplates = useCallback(async () => {
    try {
      const data = await getTemplates()
      appState.setTemplates(data.templates || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }, [appState.setTemplates])
  
  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])
  
  // Code generation hook
  const { handleVoiceCommand } = useCodeGeneration(appState, logger, loadCheckpoints, setStatus)
  
  // Panel management hook
  const panels = usePanelManagement(appState, logger)
  
  // Handle voice command processing
  useEffect(() => {
    if (transcript && !isListening && !appState.isGenerating && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript
      handleVoiceCommand(transcript)
    }
  }, [transcript, isListening, appState.isGenerating, handleVoiceCommand])
  
  // Log when listening state changes
  useEffect(() => {
    if (isListening) {
      loggerRef.current.info(t('app:status.listening'))
    } else if (!isListening && transcript) {
      loggerRef.current.success(t('app:status.updated'))
    }
  }, [isListening, transcript, t])
  
  // Template selection handler
  const handleSelectTemplate = useCallback((templateCode, template) => {
    appState.setCode(templateCode)
    setStatus(t('app:messages.templateApplied', { name: template.name }))
    logger.info(`📌 ${t('app:messages.templateApplied', { name: template.name })}`)
    panels.closeTemplatesPanel()
  }, [appState.setCode, setStatus, logger, t, panels])
  
  // Checkpoint restoration handler
  const handleRestoreCheckpoint = useCallback((restoredCode, checkpoint) => {
    appState.setCode(restoredCode)
    appState.setCheckpointId(checkpoint.id)
    if (checkpoint.pageId && checkpoint.pageId !== appState.pageId) {
      appState.setPageId(checkpoint.pageId)
    }
    setStatus(t('app:messages.versionRestored'))
    logger.info(`📌 ${t('app:messages.versionRestored')}: ${checkpoint.prompt.substring(0, 50)}...`)
    if (checkpoint.pageId) {
      setTimeout(() => loadCheckpoints(), 300)
    }
  }, [appState, setStatus, logger, t, loadCheckpoints])
  
  // Element selection handler
  const handleElementSelected = useCallback((elementInfo) => {
    appState.setSelectedComponent(elementInfo)
    appState.setSelectionMode(false)
    setStatus(t('app:messages.componentSelected', { tagName: elementInfo.tagName }))
    logger.info(`📌 ${t('app:messages.componentSelected', { tagName: elementInfo.tagName })} (${elementInfo.selector})`)
  }, [appState, setStatus, logger, t])
  
  // Handle navigation to home
  const handleGoHome = useCallback(() => {
    appState.setCode('<!-- Di algo para empezar -->')
    appState.setSelectedComponent(null)
    appState.setSelectionMode(false)
    panels.closeCheckpointsPanel()
    panels.closeTemplatesPanel()
    panels.closeApiKeysPanel()
    setStatus(t('app:status.ready'))
    logger.info('🏠 ' + t('app:messages.navigatedToHome'))
  }, [appState, panels, setStatus, logger, t])
  
  // Show loading state if i18n is not ready
  if (!ready || !i18nReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando traducciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black">
      <AppHeader
        status={status}
        onGoHome={handleGoHome}
        code={appState.code}
        logger={logger}
        selectionMode={panels.selectionMode}
        selectedComponent={appState.selectedComponent}
        onToggleSelection={panels.toggleSelectionMode}
        templatesPanelOpen={panels.templatesPanelOpen}
        onToggleTemplates={panels.toggleTemplatesPanel}
        checkpointsPanelOpen={panels.checkpointsPanelOpen}
        checkpoints={appState.checkpoints}
        onToggleCheckpoints={panels.toggleCheckpointsPanel}
        apiKeysPanelOpen={panels.apiKeysPanelOpen}
        onToggleApiKeys={panels.toggleApiKeysPanel}
        pageId={appState.pageId}
        detectedAPIs={appState.detectedAPIs}
        isSupported={isSupported}
        isListening={isListening}
        isGenerating={appState.isGenerating}
        onToggleListening={toggleListening}
      />

      <AppContent
        isGenerating={appState.isGenerating}
        code={appState.code}
        onExampleClick={handleVoiceCommand}
        onStartSpeaking={() => {
          if (isSupported && toggleListeningRef.current) {
            toggleListeningRef.current()
          }
        }}
        onViewTemplates={panels.openTemplatesPanel}
        isSpeechSupported={isSupported}
        selectionMode={panels.selectionMode}
        onElementSelected={handleElementSelected}
        pageId={appState.pageId}
      />

      <AppFooter
        code={appState.code}
        isGenerating={appState.isGenerating}
        isSupported={isSupported}
      />

      {/* Templates Panel */}
      <TemplatesPanel
        templates={appState.templates}
        onSelectTemplate={handleSelectTemplate}
        isOpen={panels.templatesPanelOpen}
        onClose={panels.closeTemplatesPanel}
      />

      {/* Checkpoints Panel */}
      {appState.pageId && (
        <CheckpointsPanel
          checkpoints={appState.checkpoints}
          pageId={appState.pageId}
          onRestoreCheckpoint={handleRestoreCheckpoint}
          isOpen={panels.checkpointsPanelOpen}
          onClose={panels.closeCheckpointsPanel}
        />
      )}

      {/* API Keys Configuration Panel */}
      {appState.pageId && (
        <APIKeysConfig
          detectedAPIs={appState.detectedAPIs}
          pageId={appState.pageId}
          isOpen={panels.apiKeysPanelOpen}
          onClose={panels.closeApiKeysPanel}
          onKeysUpdated={() => {
            logger.success(`🔑 ${t('components:apiKeys.saved')}. ${t('app:status.updated')}`)
            appState.setApiKeysPanelDismissed(false)
          }}
        />
      )}
    </div>
  )
}

export default App
