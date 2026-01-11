import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function TypingIndicator() {
  const { lang } = useLanguage();
  const displayLang = lang === 'ar' ? 'ar' : 'en';

  return (
    <div className="flex items-start gap-3 message-enter">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-semibold text-primary">AI</span>
      </div>
      <div className={cn(
        "rounded-2xl rounded-ts-md px-4 py-3",
        "bg-white text-foreground"
      )}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
          </div>
          <span className="text-sm text-muted-foreground">{t('chat.typing', displayLang)}</span>
        </div>
      </div>
    </div>
  );
}

