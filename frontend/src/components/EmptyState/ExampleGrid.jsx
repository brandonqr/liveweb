/**
 * ExampleGrid Component
 * Grid container for example cards
 */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { staggerContainer } from '../../lib/animations'
import { getExamplePrompts } from './emptyStateData'
import { ExampleCard } from './ExampleCard'

/**
 * ExampleGrid component
 * @param {Function} onExampleClick - Callback when example is clicked
 */
export const ExampleGrid = ({ onExampleClick }) => {
  const { t } = useTranslation(['components'])

  const examples = getExamplePrompts(t)

  return (
    <motion.div variants={staggerContainer}>
      <h2 className="text-2xl font-semibold text-white mb-8 text-center mt-4">
        {t('components:emptyState.examplesTitle')}
      </h2>
      
      {/* Grid Container - Bento Box Style */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-4 mt-16 pb-16"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {examples.map((example, index) => (
          <ExampleCard
            key={example.id}
            example={example}
            onClick={onExampleClick}
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ExampleGrid
