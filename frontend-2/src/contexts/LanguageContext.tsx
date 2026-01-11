import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types/chat';
import { getDirection } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('preferred_language');
    return (stored === 'ar' || stored === 'en') ? stored : 'en';
  });

  const dir = getDirection(lang);

  useEffect(() => {
    localStorage.setItem('preferred_language', lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
