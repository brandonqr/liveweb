import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files - Vite handles JSON imports automatically
import commonEs from './locales/es/common.json';
import appEs from './locales/es/app.json';
import componentsEs from './locales/es/components.json';
import errorsEs from './locales/es/errors.json';

import commonEn from './locales/en/common.json';
import appEn from './locales/en/app.json';
import componentsEn from './locales/en/components.json';
import errorsEn from './locales/en/errors.json';

// Initialize i18n synchronously
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    defaultNS: 'common',
    ns: ['common', 'app', 'components', 'errors'],
    
    // Language detection configuration
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nLng',
      caches: ['localStorage'],
    },
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React-specific configuration
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
    
    // Resources (translations) - loaded synchronously
    resources: {
      es: {
        common: commonEs,
        app: appEs,
        components: componentsEs,
        errors: errorsEs,
      },
      en: {
        common: commonEn,
        app: appEn,
        components: componentsEn,
        errors: errorsEn,
      },
    },
    
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
    
    // Initialize immediately (synchronously)
    initImmediate: true,
  });

// Log initialization status in development
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 i18n initialized:', i18n.isInitialized);
  console.log('🌐 Current language:', i18n.language);
  console.log('🌐 Test translation:', i18n.t('app:title'));
  console.log('🌐 Available namespaces:', i18n.options.ns);
}

export default i18n;
