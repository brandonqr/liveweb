/**
 * ExampleCard Component
 * Individual example card in the grid
 */
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { scaleIn, hoverLift, tapScale } from '../../lib/animations'

/**
 * ExampleCard component
 * @param {Object} example - Example data { id, prompt, icon, category }
 * @param {Function} onClick - Click handler
 * @param {number} index - Index for animation
 */
export const ExampleCard = ({ example, onClick, index }) => {
  const IconComponent = example.icon

  return (
    <motion.button
      onClick={() => onClick(example.prompt)}
      whileHover={hoverLift}
      whileTap={tapScale}
      className="group relative flex flex-col items-start p-6 h-full min-h-[200px] rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all duration-300 text-left overflow-hidden"
      variants={scaleIn}
      custom={index}
    >
      {/* Fondo Gradiente Sutil al Hover (Blue Spot) */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-blue-600/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header de la Card: Icono + Badge */}
      <div className="mb-6 relative z-10">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      {/* Contenido: Título y Texto agrupados */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-100 transition-colors">
          {example.category}
        </h3>
        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[90%] group-hover:text-gray-300">
          {example.prompt}
        </p>
      </div>

      {/* Decoración: Flecha de acción (Bottom Right) */}
      <div className="absolute bottom-6 right-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <ArrowRight className="w-5 h-5 text-blue-400" />
      </div>
    </motion.button>
  )
}

export default ExampleCard
