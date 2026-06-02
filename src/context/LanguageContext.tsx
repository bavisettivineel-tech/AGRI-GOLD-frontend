import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../translations';
import type { Language, TranslationKey } from '../translations';

interface LangCtx {
  lang: Language;
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LangCtx>({} as LangCtx);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem('agri_lang') as Language) || 'en'
  );

  const t = (key: TranslationKey): string =>
    translations[lang][key] || key;

  const toggleLang = () => {
    const next = lang === 'en' ? 'te' : 'en';
    setLang(next);
    localStorage.setItem('agri_lang', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);