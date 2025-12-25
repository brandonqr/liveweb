import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mic } from 'lucide-react'

/**
 * AppFooter Component
 * Floating action bar with contextual keyboard shortcut hint
 * Shows different message for creating vs editing
 */
export const AppFooter = ({ code, isGenerating, isSupported }) => {
  const { t } = useTranslation(['components'])

  // Show footer when voice is supported and not generating
  // Hide only if voice is not supported
  if (!isSupported || isGenerating) {
    return null
  }

  // Determine if we're in "create" or "edit" mode
  const isEmpty = code === '<!-- Di algo para empezar -->' || code.trim() === ''
  const hintKey = isEmpty ? 'voice.createHint' : 'voice.editHint'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="group fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shadow-lg opacity-60 hover:opacity-100 hover:bg-white/8 hover:border-white/10 transition-all duration-300"
    >
      <div className="w-6 h-6 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400/80 group-hover:text-blue-400 group-hover:bg-blue-500/20 transition-colors">
        <Mic className="w-3.5 h-3.5" />
      </div>
      <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors hidden sm:block">
        <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white/5 rounded text-white/80 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-colors">
          T
        </kbd>
        <span className="ml-1.5">
          {t(`components:${hintKey}`)}
        </span>
      </p>
    </motion.div>
  )
}
