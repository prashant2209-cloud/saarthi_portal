import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enPages from './locales/en/pages.json';
import enComponents from './locales/en/components.json';
import hiCommon from './locales/hi/common.json';
import hiPages from './locales/hi/pages.json';
import hiComponents from './locales/hi/components.json';

const resources = {
  en: {
    common: enCommon,
    pages: enPages,
    components: enComponents,
  },
  hi: {
    common: hiCommon,
    pages: hiPages,
    components: hiComponents,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
