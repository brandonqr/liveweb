/**
 * CheckpointsList Component
 * List of checkpoints with empty state
 */
import { useTranslation } from 'react-i18next';
import { CheckpointItem } from './CheckpointItem';

/**
 * CheckpointsList component
 * @param {Array} checkpoints - Array of checkpoints
 * @param {Function} onCheckpointClick - Click handler
 */
export const CheckpointsList = ({ checkpoints, onCheckpointClick }) => {
  const { t, i18n } = useTranslation(['components']);

  if (checkpoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-body font-semibold text-gray-900 dark:text-white mb-1">
          {t('components:checkpoints.noVersions')}
        </h3>
        <p className="text-body-small text-gray-500 dark:text-gray-400 max-w-xs">
          {t('components:checkpoints.noVersionsDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {checkpoints.map((checkpoint, index) => (
        <CheckpointItem
          key={checkpoint.id}
          checkpoint={checkpoint}
          index={index}
          totalCount={checkpoints.length}
          onClick={onCheckpointClick}
          t={t}
          language={i18n.language}
        />
      ))}
    </div>
  );
};

export default CheckpointsList;
