import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

import { detectBrowserLanguage, isAppLanguage, syncDocumentLanguage } from './language';

// Read the persisted language from localStorage (same storage key as the
// Zustand store). Nothing saved yet (first run) → follow the browser language,
// exactly as the preferences slice's default does, so i18next and the store
// agree from the first render.
function getInitialLanguage(): string {
  try {
    const raw = localStorage.getItem('music-theory-app');
    if (raw) {
      const saved = JSON.parse(raw)?.state?.language;
      if (isAppLanguage(saved)) return saved;
    }
  } catch {
    // ignore
  }
  return detectBrowserLanguage();
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

// <html lang> follows the app language (W6-15): set it now and on every change.
syncDocumentLanguage(i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

if (import.meta.env.DEV) {
  i18n.on('missingKey', (_lngs, ns, key) => {
    console.warn(`[i18n] Missing key: ${ns}:${key}`);
  });
}

export default i18n;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Portugu\u00eas' },
  { code: 'es', label: 'Espa\u00f1ol' },
] as const;
