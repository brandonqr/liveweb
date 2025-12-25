/**
 * ToastContainer Component
 * Container for toast notifications with animations
 */
import { motion, AnimatePresence } from 'framer-motion';
import { ToastItem } from './ToastItem';

/**
 * ToastContainer component
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects { id, level, message, duration? }
 * @param {Function} props.removeToast - Function to remove a toast by id
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            className="pointer-events-auto"
          >
            <ToastItem
              id={toast.id}
              level={toast.level}
              message={toast.message}
              onClose={removeToast}
              duration={toast.duration || 3000}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
