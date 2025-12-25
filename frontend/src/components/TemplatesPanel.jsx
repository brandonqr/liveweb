import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getTemplate } from '../services/api';

export const TemplatesPanel = ({ 
  templates = [], 
  onSelectTemplate,
  isOpen = false,
  onClose 
}) => {
  const { t } = useTranslation(['components']);
  
  const handleTemplateClick = async (template) => {
    try {
      const data = await getTemplate(template.id);
      onSelectTemplate(data.code, template);
    } catch (error) {
      console.error('Error loading template:', error);
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
          <div className="px-6 py-4 border-b border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-heading-4 font-semibold text-gray-900 dark:text-white">
                    {t('components:templates.title')}
                  </h2>
                  <p className="text-caption text-gray-500 dark:text-gray-400 mt-0.5">
                    {t('components:templates.subtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                aria-label={t('components:templates.close')}
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Templates List */}
          <div className="flex-1 overflow-y-auto">
            {templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </div>
                <h3 className="text-body font-semibold text-gray-900 dark:text-white mb-1">
                  {t('components:templates.noTemplates')}
                </h3>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {templates.map((template, index) => (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                    onClick={() => handleTemplateClick(template)}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {template.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-body-small font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-caption text-gray-600 dark:text-gray-400">
                          {template.description}
                        </p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {template.keywords.slice(0, 3).map((keyword, i) => (
                            <span key={i} className="text-caption px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-r from-gray-50/30 to-transparent dark:from-gray-800/20 dark:to-transparent">
            <p className="text-caption text-gray-500 dark:text-gray-400 text-center">
              {t('components:templates.footer')}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
