import { X, Check, AlertCircle, Zap, Target, Database, Gauge } from 'lucide-react';
import { ExplainData, Message } from '@/types/chat';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ExplainPanelProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
}

export function ExplainPanel({ isOpen, onClose, message }: ExplainPanelProps) {
  const { lang } = useLanguage();
  const displayLang = lang === 'ar' ? 'ar' : 'en';
  const explain = message?.explain;

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
        onClick={onClose}
      />
      
      <aside className={cn(
        "flex flex-col h-full bg-card border-s border-border",
        "w-80 shrink-0",
        "fixed inset-y-0 end-0 z-50 lg:relative lg:z-auto",
        "animate-slide-in-right lg:animate-none"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">{t('chat.explainPanel', displayLang)}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {!explain ? (
            <EmptyExplain lang={displayLang} />
          ) : (
            <div className="p-4 space-y-4">
              {/* Language */}
              <ExplainCard
                icon={<span className="text-lg">🌐</span>}
                label={t('chat.detectedLang', displayLang)}
              >
                <Badge variant="secondary" className="text-sm">
                  {explain.detectedLang === 'ar' ? 'العربية' : 'English'}
                </Badge>
              </ExplainCard>

              {/* Rule Hit */}
              <ExplainCard
                icon={explain.ruleHit ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-muted-foreground" />}
                label={t('chat.ruleHit', displayLang)}
              >
                <Badge variant={explain.ruleHit ? "default" : "secondary"} className={cn(
                  explain.ruleHit ? "bg-green-500 hover:bg-green-600" : ""
                )}>
                  {explain.ruleHit ? t('chat.yes', displayLang) : t('chat.no', displayLang)}
                </Badge>
              </ExplainCard>

              {/* Intent */}
              <ExplainCard
                icon={<Target className="w-4 h-4 text-primary" />}
                label={t('chat.intent', displayLang)}
              >
                <div className="space-y-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {explain.intent}
                  </Badge>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('chat.confidence', displayLang)}</span>
                      <span className="font-medium">{(explain.intentConfidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={explain.intentConfidence * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </ExplainCard>

              {/* Retrieval Method */}
              <ExplainCard
                icon={<Database className="w-4 h-4 text-primary" />}
                label={t('chat.retrievalMethod', displayLang)}
              >
                <Badge variant="secondary" className="font-mono uppercase">
                  {explain.retrievalMethod}
                </Badge>
              </ExplainCard>

              {/* Top Matches */}
              <ExplainCard
                icon={<Gauge className="w-4 h-4 text-primary" />}
                label={t('chat.topMatches', displayLang)}
              >
                <div className="space-y-2">
                  {explain.topMatches.map((match, i) => (
                    <div key={i} className="p-2 rounded-lg bg-secondary border border-border">
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {match.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={match.similarity * 100} 
                          className="h-1.5 flex-1"
                        />
                        <span className={cn(
                          "text-xs font-medium",
                          match.similarity > 0.8 ? "text-green-600" : 
                          match.similarity > 0.6 ? "text-yellow-600" : 
                          "text-red-600"
                        )}>
                          {(match.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ExplainCard>

              {/* Decision */}
              <ExplainCard
                icon={explain.decision === 'answer' ? 
                  <Check className="w-4 h-4 text-green-500" /> : 
                  <AlertCircle className="w-4 h-4 text-primary" />
                }
                label={t('chat.decision', displayLang)}
              >
                <Badge 
                  variant={explain.decision === 'answer' ? "default" : "secondary"}
                  className={cn(
                    "text-sm",
                    explain.decision === 'answer' ? "bg-green-500 hover:bg-green-600" : ""
                  )}
                >
                  {explain.decision === 'answer' ? t('chat.answer', displayLang) : t('chat.fallback', displayLang)}
                </Badge>
              </ExplainCard>
            </div>
          )}
        </ScrollArea>
      </aside>
    </>
  );
}

interface ExplainCardProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function ExplainCard({ icon, label, children }: ExplainCardProps) {
  return (
    <div className="rounded-xl bg-secondary border border-border p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function EmptyExplain({ lang }: { lang: 'ar' | 'en' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
      <Zap className="w-10 h-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm text-muted-foreground">
        {lang === 'ar' 
          ? 'انقر على "شرح" في أي رسالة لعرض التفاصيل'
          : 'Click "Explain" on any message to view details'
        }
      </p>
    </div>
  );
}

