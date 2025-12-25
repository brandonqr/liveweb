/**
 * APIKeysConfigHeader Component
 * Header section of the API Keys configuration panel
 */
import { useTranslation } from 'react-i18next';

/**
 * APIKeysConfigHeader component
 * @param {Function} onClose - Close handler
 */
export const APIKeysConfigHeader = ({ onClose }) => {
  const { t } = useTranslation(['components']);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">{t('components:apiKeys.title')}</h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors text-2xl leading-none"
          aria-label={t('components:apiKeys.close')}
        >
          ×
        </button>
      </div>
      <p className="text-indigo-100 text-sm">
        {t('components:apiKeys.subtitle')}
      </p>
    </div>
  );
};

export default APIKeysConfigHeader;
