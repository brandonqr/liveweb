/**
 * Toast Utilities
 * Centralized styles, icons, and constants for toast notifications
 */
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

/**
 * Toast level constants
 */
export const TOAST_LEVELS = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

/**
 * Get Tailwind CSS classes for toast based on level
 * @param {string} level - Toast level
 * @returns {string} CSS classes
 */
export function getToastStyles(level) {
  const styles = {
    info: 'bg-blue-500 text-white border-blue-600',
    success: 'bg-emerald-500 text-white border-emerald-600',
    warning: 'bg-amber-500 text-white border-amber-600',
    error: 'bg-red-500 text-white border-red-600'
  };
  return styles[level] || styles.info;
}

/**
 * Get Lucide-React icon component for toast level
 * @param {string} level - Toast level
 * @returns {React.Component} Icon component
 */
export function getToastIcon(level) {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
  };
  return icons[level] || Info;
}

/**
 * Get close icon component
 * @returns {React.Component} X icon component
 */
export function getCloseIcon() {
  return X;
}
