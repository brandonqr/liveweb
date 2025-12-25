/**
 * CheckpointItem Component
 * Individual checkpoint item in the list
 */
import { motion } from 'framer-motion';
import { formatCheckpointTime, truncatePrompt } from './utils/checkpointUtils';

/**
 * CheckpointItem component
 * @param {Object} checkpoint - Checkpoint data { id, prompt, timestamp, isActive }
 * @param {number} index - Index in the list
 * @param {number} totalCount - Total number of checkpoints
 * @param {Function} onClick - Click handler
 * @param {Function} t - Translation function
 * @param {string} language - Current language
 */
export const CheckpointItem = ({
  checkpoint,
  index,
  totalCount,
  onClick,
  t,
  language
}) => {
  const versionNumber = totalCount - index;
  const formattedTime = formatCheckpointTime(checkpoint.timestamp, t, language);
  const truncatedPrompt = truncatePrompt(checkpoint.prompt, 50);

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => onClick(checkpoint)}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 relative group ${
        checkpoint.isActive
          ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/30 dark:to-blue-900/20 border-2 border-blue-300 dark:border-blue-700 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20'
          : 'bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
      }`}
    >
      {/* Active Indicator Bar */}
      {checkpoint.isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-l-xl" />
      )}
      
      <div className="flex items-start gap-3 pl-1">
        {/* Version Number Badge */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs ${
          checkpoint.isActive
            ? 'bg-blue-600 dark:bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}>
          {versionNumber}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className={`text-body-small font-semibold leading-snug ${
              checkpoint.isActive
                ? 'text-blue-900 dark:text-blue-100'
                : 'text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white'
            }`}>
              {truncatedPrompt}
            </p>
            {checkpoint.isActive && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-shrink-0 p-1 rounded-full bg-blue-600 dark:bg-blue-500"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`text-caption ${
              checkpoint.isActive
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formattedTime}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default CheckpointItem;
