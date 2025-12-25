import { useTranslation } from 'react-i18next'
import { Loader } from './Loader'
import { EmptyState } from './EmptyState/index.jsx'
import { CodeRenderer } from './CodeRenderer'

/**
 * AppContent Component
 * Main content area with conditional rendering
 */
export const AppContent = ({
  isGenerating,
  code,
  onExampleClick,
  onStartSpeaking,
  onViewTemplates,
  isSpeechSupported,
  selectionMode,
  onElementSelected,
  pageId
}) => {
  const { t } = useTranslation(['app'])

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Show Loader when generating */}
      {isGenerating ? (
        <Loader message={t('app:messages.generatingCode')} />
      ) : (
        <>
          {/* Show EmptyState when no code is generated */}
          {(code === '<!-- Di algo para empezar -->' || code.trim() === '') ? (
            <EmptyState
              onExampleClick={onExampleClick}
              onStartSpeaking={onStartSpeaking}
              onViewTemplates={onViewTemplates}
              isSpeechSupported={isSpeechSupported}
            />
          ) : (
            <div className="h-full w-full relative">
              {/* Invisible overlay to capture keyboard events when iframe has focus */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                tabIndex={-1}
                onKeyDown={(e) => {
                  // This won't fire if iframe has focus, but helps when clicking outside
                  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    // Let the window listener handle it
                  }
                }}
              />
              <CodeRenderer 
                code={code} 
                selectionMode={selectionMode}
                onElementSelected={onElementSelected}
                pageId={pageId}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
