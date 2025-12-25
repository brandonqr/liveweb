/**
 * API Keys Configuration Panel
 * Main component for configuring API keys
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAPIKeys } from './hooks/useAPIKeys';
import { APIKeysConfigHeader } from './APIKeysConfigHeader';
import { APIKeysList } from './APIKeysList';

/**
 * APIKeysConfig component
 * @param {Array} detectedAPIs - APIs detected in code (for backward compatibility)
 * @param {string} pageId - Current page ID
 * @param {boolean} isOpen - Whether panel is open
 * @param {Function} onClose - Close handler
 * @param {Function} onKeysUpdated - Callback when keys are updated
 */
export const APIKeysConfig = ({ 
  detectedAPIs = [], 
  pageId, 
  isOpen, 
  onClose,
  onKeysUpdated 
}) => {
  const { t } = useTranslation(['components']);
  const {
    apiKeys,
    saving,
    availableAPIs,
    loadingAPIs,
    handleSave,
    handleDelete,
    handleChange
  } = useAPIKeys(pageId, isOpen, onKeysUpdated);

  // Use availableAPIs if loaded, otherwise fallback to detectedAPIs
  const apisToShow = availableAPIs.length > 0 ? availableAPIs : detectedAPIs;

  if (!isOpen || !pageId) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <APIKeysConfigHeader onClose={onClose} />

            {/* Content */}
            {loadingAPIs ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-600">{t('components:apiKeys.loading')}</p>
              </div>
            ) : (
              <APIKeysList
                apis={apisToShow}
                apiKeys={apiKeys}
                saving={saving}
                onChange={handleChange}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            )}

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>{t('components:apiKeys.security')}</strong> {t('components:apiKeys.securityMessage')}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default APIKeysConfig;
