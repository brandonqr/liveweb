/**
 * EmptyState Component - AI-Modern Production Ready Design
 * Main orchestrator component
 */
import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '../../lib/animations'
import { EmptyStateHero } from './EmptyStateHero'
import { ExampleGrid } from './ExampleGrid'

/**
 * EmptyState component
 * @param {Function} onExampleClick - Callback when user clicks an example prompt
 * @param {Function} onStartSpeaking - Callback to start voice recognition
 * @param {Function} onViewTemplates - Callback to open templates panel
 * @param {boolean} isSpeechSupported - Whether speech recognition is supported
 */
export const EmptyState = ({ 
  onExampleClick, 
  onStartSpeaking, 
  onViewTemplates,
  isSpeechSupported = false 
}) => {
  return (
    <div className="relative flex items-center justify-center h-full w-full bg-black overflow-hidden">
      {/* Spotlight Background - Enhanced Blue Glow */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      
      {/* Hero Background - Radial Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[100px] rounded-full" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl w-full px-6 py-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <EmptyStateHero
          onStartSpeaking={onStartSpeaking}
          onViewTemplates={onViewTemplates}
          isSpeechSupported={isSpeechSupported}
        />

        {/* Example Prompts Grid */}
        <motion.div variants={fadeInUp}>
          <ExampleGrid onExampleClick={onExampleClick} />
        </motion.div>

      </motion.div>
    </div>
  )
}

export default EmptyState
