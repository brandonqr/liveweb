/**
 * CheckpointsPanel Component
 * Main component for viewing and restoring checkpoints
 */
import { motion, AnimatePresence } from 'framer-motion';
import { getCheckpointCode } from '../../services/api';
import { CheckpointsPanelHeader } from './CheckpointsPanelHeader';
import { CheckpointsList } from './CheckpointsList';
import { CheckpointsPanelFooter } from './CheckpointsPanelFooter';

/**
 * CheckpointsPanel component
 * @param {Array} checkpoints - Array of checkpoints
 * @param {string} pageId - Current page ID
 * @param {Function} onRestoreCheckpoint - Callback to restore checkpoint
 * @param {boolean} isOpen - Whether panel is open
 * @param {Function} onClose - Close handler
 */
export const CheckpointsPanel = ({ 
  checkpoints = [], 
  pageId, 
  onRestoreCheckpoint,
  isOpen = false,
  onClose 
}) => {
  const handleCheckpointClick = async (checkpoint) => {
    try {
      const data = await getCheckpointCode(pageId, checkpoint.id);
      onRestoreCheckpoint(data.code, checkpoint);
    } catch (error) {
      console.error('Error restoring checkpoint:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed right-0 top-0 h-full w-96 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <CheckpointsPanelHeader onClose={onClose} />

          {/* Checkpoints List */}
          <div className="flex-1 overflow-y-auto">
            <CheckpointsList
              checkpoints={checkpoints}
              onCheckpointClick={handleCheckpointClick}
            />
          </div>

          {/* Footer */}
          <CheckpointsPanelFooter count={checkpoints.length} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckpointsPanel;
