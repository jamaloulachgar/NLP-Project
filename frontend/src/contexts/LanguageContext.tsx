import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, languages } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('fsr_language');
    return (saved as Language) || 'fr';
  });

  const dir = languages[lang].dir;

  useEffect(() => {
    localStorage.setItem('fsr_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    
    // Update font family based on language
    if (lang === 'ar') {
      document.documentElement.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
    }
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
