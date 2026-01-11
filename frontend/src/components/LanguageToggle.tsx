import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <button
        onClick={() => setLang('en')}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
          lang === 'en' 
            ? "bg-card text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ar')}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
          lang === 'ar' 
            ? "bg-card text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        AR
      </button>
    </div>
  );
}

