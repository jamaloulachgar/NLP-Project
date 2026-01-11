// Explain Drawer Component
// Shows AI decision metadata and explain data

import { X, Check, AlertCircle, Target, Database, Gauge } from 'lucide-react';
import { ExplainData } from '@/types/chat';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ExplainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  explain: ExplainData | null;
}

export function ExplainDrawer({ isOpen, onClose, explain }: ExplainDrawerProps) {
  const { lang } = useLanguage();
  const displayLang = lang === 'ar' ? 'ar' : 'en';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t('chatbot.explain', lang)}</SheetTitle>
          <SheetDescription>
            {displayLang === 'ar' 
              ? 'تفاصيل قرار الذكاء الاصطناعي'
              : 'AI decision details'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {!explain ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {displayLang === 'ar' 
                  ? 'لا توجد بيانات شرح متاحة'
                  : 'No explain data available'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
      </SheetContent>
    </Sheet>
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

