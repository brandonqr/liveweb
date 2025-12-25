/**
 * APIKeyForm Component
 * Individual API key form
 */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * APIKeyForm component
 * @param {Object} api - API configuration { id, name, placeholder, docsUrl }
 * @param {string} value - Current API key value
 * @param {boolean} hasKey - Whether API key is saved
 * @param {boolean} isSaving - Whether key is being saved
 * @param {Function} onChange - Change handler
 * @param {Function} onSave - Save handler
 * @param {Function} onDelete - Delete handler
 * @param {Function} getDocsUrl - Function to get docs URL
 */
export const APIKeyForm = ({
  api,
  value,
  hasKey,
  isSaving,
  onChange,
  onSave,
  onDelete,
  getDocsUrl
}) => {
  const { t } = useTranslation(['components']);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-50 rounded-xl p-5 border border-slate-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">{api.name}</h3>
          <p className="text-sm text-slate-600">
            {t('components:apiKeys.required')} {api.name}
          </p>
        </div>
        {hasKey && (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
            ✓ {t('components:apiKeys.saved')}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <input
            type="password"
            value={value || ''}
            onChange={(e) => onChange(api.id, e.target.value)}
            placeholder={t('components:apiKeys.placeholder', { apiName: api.name })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSave(api.id)}
            disabled={!value || isSaving}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? t('components:apiKeys.loading') : t('components:apiKeys.save')}
          </button>
          <a
            href={api.docsUrl || getDocsUrl(api.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors text-center"
          >
            {t('components:apiKeys.docs')}
          </a>
        </div>

        {hasKey && (
          <button
            onClick={() => onDelete(api.id)}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm"
          >
            {t('components:apiKeys.delete')}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default APIKeyForm;
