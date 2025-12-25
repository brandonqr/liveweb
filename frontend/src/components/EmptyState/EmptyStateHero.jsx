/**
 * EmptyStateHero Component
 * Hero section with title, subtitle, and action buttons
 */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles, Mic, LayoutTemplate } from 'lucide-react'
import { fadeInUp, hoverScale, tapScale } from '../../lib/animations'

/**
 * EmptyStateHero component
 * @param {Function} onStartSpeaking - Callback to start voice recognition
 * @param {Function} onViewTemplates - Callback to open templates panel
 * @param {boolean} isSpeechSupported - Whether speech recognition is supported
 */
export const EmptyStateHero = ({ 
  onStartSpeaking, 
  onViewTemplates,
  isSpeechSupported = false 
}) => {
  const { t } = useTranslation(['components'])

  return (
    <>
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        variants={fadeInUp}
      >
        {/* Animated Sparkles Icon */}
        <motion.div
          className="flex justify-center mb-6"
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.8, 1, 0.8] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-16 h-16 text-blue-400" />
        </motion.div>
        
        {/* Title with Gradient */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
          {t('components:emptyState.title')}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          {t('components:emptyState.subtitle')}
        </p>
      </motion.div>

      {/* Quick Actions - Clean Buttons with Breathing Animation */}
      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full"
        variants={fadeInUp}
      >
        {isSpeechSupported && (
          <div className="relative group">
            {/* Breathing Glow Effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25"
              animate={{
                opacity: [0.25, 0.5, 0.25],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.button
              onClick={onStartSpeaking}
              whileHover={hoverScale}
              whileTap={tapScale}
              className="relative h-[60px] px-10 text-lg rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-3 shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <Mic className="w-6 h-6" />
              <span>{t('components:emptyState.actions.speak')}</span>
              {/* Destello interno */}
              <div className="absolute inset-0 rounded-full border border-white/20" />
            </motion.button>
          </div>
        )}
        
        <motion.button
          onClick={onViewTemplates}
          whileHover={hoverScale}
          whileTap={tapScale}
          className="group h-[60px] px-10 text-lg rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center gap-3 backdrop-blur-md transition-all"
        >
          <LayoutTemplate className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <span>{t('components:emptyState.actions.templates')}</span>
        </motion.button>
      </motion.div>
    </>
  )
}

export default EmptyStateHero
