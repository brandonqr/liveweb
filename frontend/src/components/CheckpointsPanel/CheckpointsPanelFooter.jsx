/**
 * CheckpointsPanelFooter Component
 * Footer section of the checkpoints panel
 */
import { useTranslation } from 'react-i18next';

/**
 * CheckpointsPanelFooter component
 * @param {number} count - Number of checkpoints
 */
export const CheckpointsPanelFooter = ({ count }) => {
  const { t } = useTranslation(['components']);

  if (count === 0) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-r from-gray-50/30 to-transparent dark:from-gray-800/20 dark:to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
          <p className="text-caption font-medium text-gray-600 dark:text-gray-300">
            {t('components:checkpoints.active')}
          </p>
        </div>
        <p className="text-caption text-gray-500 dark:text-gray-400">
          {t('components:checkpoints.count', { count })}
        </p>
      </div>
    </div>
  );
};

export default CheckpointsPanelFooter;
