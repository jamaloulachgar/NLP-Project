// Sources Component
// Displays source links for assistant messages

import { ExternalLink } from 'lucide-react';
import { Source } from '@/types/chat';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface SourcesProps {
  sources: Source[];
  className?: string;
}

export function Sources({ sources, className }: SourcesProps) {
  const { lang } = useLanguage();

  if (!sources || sources.length === 0) return null;

  return (
    <div className={cn("mt-3 pt-3 border-t space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {t('chatbot.sources', lang)}
      </p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
              "bg-secondary text-secondary-foreground text-xs font-medium",
              "hover:bg-primary hover:text-primary-foreground transition-colors"
            )}
          >
            <ExternalLink className="w-3 h-3" />
            <span>{source.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

