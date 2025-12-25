import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { headerVariants, hoverScale, tapScale, fadeIn } from '../lib/animations'
import { LanguageSwitcher } from './LanguageSwitcher'
import { downloadCodeAsZip } from '../utils/downloadCode'
import { hasAPIKey } from '../utils/apiKeysStorage'

/**
 * AppHeader Component
 * Professional glassmorphism header with navigation and action buttons
 */
export const AppHeader = ({
  status,
  onGoHome,
  code,
  logger,
  // Selection
  selectionMode,
  selectedComponent,
  onToggleSelection,
  // Panels
  templatesPanelOpen,
  onToggleTemplates,
  checkpointsPanelOpen,
  checkpoints,
  onToggleCheckpoints,
  apiKeysPanelOpen,
  onToggleApiKeys,
  pageId,
  detectedAPIs,
  // Speech
  isSupported,
  isListening,
  isGenerating,
  onToggleListening
}) => {
  const { t } = useTranslation(['app', 'common', 'components', 'errors'])

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20"
      >
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-4">
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            onClick={onGoHome}
            whileHover={hoverScale}
            whileTap={tapScale}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title={t('app:titles.goHome')}
          >
            {/* Logo Placeholder */}
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Gemini 3 Flash
            </h1>
          </motion.button>
          {/* Status Badge */}
          <motion.div
            key={status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              {status === t('app:status.ready') ? 'System Ready' : status}
            </span>
          </motion.div>
        </div>
        
        {/* Right: Actions Toolbar */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={hoverScale}
            whileTap={tapScale}
            onClick={onToggleSelection}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-white ${selectionMode ? 'bg-green-600/20 border-green-500/50 hover:bg-green-600/30' : ''} ${selectedComponent ? 'ring-2 ring-green-400/50' : ''}`}
            title={t('app:titles.selectComponent')}
          >
            <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            {selectedComponent ? t('app:buttons.editComponent') : selectionMode ? t('app:buttons.cancel') : t('app:buttons.select')}
          </motion.button>
          {selectedComponent && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-body-tiny font-medium"
            >
              {t('app:messages.componentSelectedBadge', { tagName: selectedComponent.tagName })}
            </motion.div>
          )}
          <motion.button
            whileHover={hoverScale}
            whileTap={tapScale}
            onClick={onToggleTemplates}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-white ${templatesPanelOpen ? 'bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30' : ''}`}
            title={t('app:titles.viewTemplates')}
          >
            <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            {t('app:buttons.templates')}
          </motion.button>
          {pageId && (
            <motion.button
              whileHover={hoverScale}
              whileTap={tapScale}
              onClick={onToggleCheckpoints}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-white ${checkpointsPanelOpen ? 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/30' : ''}`}
              title={t('app:titles.viewHistory')}
            >
              <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('app:buttons.history')} {checkpoints.length > 0 && `(${checkpoints.length})`}
            </motion.button>
          )}
          {/* API Keys Button - Always visible */}
          <motion.button
            whileHover={hoverScale}
            whileTap={tapScale}
            onClick={onToggleApiKeys}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-white relative ${apiKeysPanelOpen ? 'bg-amber-600/20 border-amber-500/50 hover:bg-amber-600/30' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
            title={t('app:titles.configureApiKeys')}
            disabled={!pageId}
          >
            <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {t('app:buttons.apiKeys')}
            {pageId && detectedAPIs.length > 0 && (() => {
              const apisWithoutKeys = detectedAPIs.filter(api => !hasAPIKey(pageId, api.id))
              const unconfiguredCount = apisWithoutKeys.length
              return unconfiguredCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unconfiguredCount}
                </span>
              ) : null
            })()}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              if (code && code.trim() !== '' && code !== '<!-- Di algo para empezar -->') {
                try {
                  await downloadCodeAsZip(code)
                  logger.success(t('common:success'))
                } catch (error) {
                  logger.error(t('errors:downloadZip', { message: error.message }))
                }
              }
            }}
            disabled={!code || code.trim() === '' || code === '<!-- Di algo para empezar -->'}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('app:titles.downloadCode')}
          >
            <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('app:buttons.download')}
          </motion.button>
          
          {isSupported ? (
            <motion.button
              whileHover={!isGenerating && !isListening ? hoverScale : {}}
              whileTap={!isGenerating && !isListening ? tapScale : {}}
              onClick={onToggleListening}
              disabled={isGenerating}
              title={code && code !== '<!-- Di algo para empezar -->' && code.trim() !== '' 
                ? t('components:voice.tooltipEdit') 
                : t('components:voice.tooltipCreate')}
              aria-label={code && code !== '<!-- Di algo para empezar -->' && code.trim() !== '' 
                ? t('components:voice.tooltipEdit') 
                : t('components:voice.tooltipCreate')}
              className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none ${
                isListening
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isListening ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{t('app:buttons.stop')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    <span>{t('app:buttons.speak')}</span>
                  </>
                )}
              </span>
            </motion.button>
          ) : (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="px-4 py-2 text-orange-100 bg-orange-500/20 backdrop-blur-md rounded-lg border border-orange-400/30 text-sm font-medium shadow-lg"
            >
              {t('app:messages.speechNotSupported')}
            </motion.div>
          )}
          <LanguageSwitcher />
        </div>
      </motion.header>
      
      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
