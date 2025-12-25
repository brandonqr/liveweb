/**
 * CheckpointsPanelHeader Component
 * Header section of the checkpoints panel
 */
import { useTranslation } from 'react-i18next';

/**
 * CheckpointsPanelHeader component
 * @param {Function} onClose - Close handler
 */
export const CheckpointsPanelHeader = ({ onClose }) => {
  const { t } = useTranslation(['components']);

  return (
    <div className="px-6 py-4 border-b border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-heading-4 font-semibold text-gray-900 dark:text-white">
              {t('components:checkpoints.title')}
            </h2>
            <p className="text-caption text-gray-500 dark:text-gray-400 mt-0.5">
              {t('components:checkpoints.subtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          aria-label={t('components:checkpoints.close')}
        >
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CheckpointsPanelHeader;
