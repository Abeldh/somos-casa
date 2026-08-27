import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations, defaultLang, supportedLangs } from '../i18n/index.js';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('preferred_lang');
    return saved && translations[saved] ? saved : defaultLang;
  });

  const changeLang = useCallback((newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('preferred_lang', newLang);
      document.documentElement.lang = newLang;
    }
  }, []);

  const t = useCallback((key, params = {}) => {
    let text = translations[lang]?.[key] || translations[defaultLang]?.[key] || key;
    // Interpolación simple: {{param}}
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });
    return text;
  }, [lang]);

  const value = useMemo(() => ({ lang, changeLang, t, supportedLangs }), [lang, changeLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n debe usarse dentro de I18nProvider');
  return ctx;
}
