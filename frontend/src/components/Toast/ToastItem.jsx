/**
 * ToastItem Component
 * Individual toast notification with auto-close functionality
 */
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getToastStyles, getToastIcon, getCloseIcon } from './utils/toastUtils';

/**
 * ToastItem component
 * @param {Object} props
 * @param {string} props.id - Unique identifier
 * @param {string} props.level - Log level: 'info', 'success', 'warning', 'error'
 * @param {string} props.message - Toast message
 * @param {Function} props.onClose - Function to call when toast should close
 * @param {number} props.duration - Duration in milliseconds before auto-close (default: 3000)
 */
export const ToastItem = ({ id, level, message, onClose, duration = 3000 }) => {
  const { t } = useTranslation(['components']);
  
  // Auto-close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Get styles and icons
  const styles = getToastStyles(level);
  const Icon = getToastIcon(level);
  const CloseIcon = getCloseIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`relative flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[280px] max-w-[400px] ${styles}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <p className="text-sm font-medium flex-1 break-words">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors ml-2"
        aria-label={t('components:toast.close')}
        type="button"
      >
        <CloseIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export default ToastItem;
