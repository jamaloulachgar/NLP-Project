import { X, HelpCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HelpPanelProps {
  onSelectQuery: (query: string) => void;
}

const exampleQueries = {
  en: [
    { category: 'Academic', queries: [
      'When does the Fall semester start?',
      'How do I register for courses?',
      'What are the exam dates?',
      'How can I view my grades?',
    ]},
    { category: 'Admissions', queries: [
      'What are the admission requirements?',
      'How do I apply for a scholarship?',
      'What documents do I need to submit?',
      'When is the application deadline?',
    ]},
    { category: 'Financial', queries: [
      'How much are the tuition fees?',
      'What payment methods are accepted?',
      'Can I pay in installments?',
      'How do I get a fee receipt?',
    ]},
    { category: 'Campus Life', queries: [
      'What are the library hours?',
      'How do I join a student club?',
      'Where is the health center?',
      'What events are happening this week?',
    ]},
  ],
  ar: [
    { category: 'أكاديمي', queries: [
      'متى يبدأ الفصل الدراسي الخريفي؟',
      'كيف أسجل في المقررات؟',
      'ما هي مواعيد الامتحانات؟',
      'كيف يمكنني عرض درجاتي؟',
    ]},
    { category: 'القبول', queries: [
      'ما هي متطلبات القبول؟',
      'كيف أتقدم للحصول على منحة؟',
      'ما هي المستندات المطلوبة؟',
      'متى ينتهي موعد التقديم؟',
    ]},
    { category: 'المالية', queries: [
      'كم هي الرسوم الدراسية؟',
      'ما هي طرق الدفع المقبولة؟',
      'هل يمكنني الدفع بالتقسيط؟',
      'كيف أحصل على إيصال الرسوم؟',
    ]},
    { category: 'الحياة الجامعية', queries: [
      'ما هي ساعات المكتبة؟',
      'كيف أنضم إلى نادي طلابي؟',
      'أين يقع المركز الصحي؟',
      'ما هي الفعاليات هذا الأسبوع؟',
    ]},
  ],
};

export function HelpPanel({ onSelectQuery }: HelpPanelProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const queries = exampleQueries[lang];

  return (
    <>
      {/* Floating help button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 end-4 z-30 rounded-full shadow-lg gap-2"
        size="sm"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="hidden sm:inline">{t('help', lang)}</span>
      </Button>

      {/* Help drawer */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={cn(
            "fixed bottom-0 inset-x-0 z-50 bg-card rounded-t-2xl shadow-2xl",
            "max-h-[70vh] animate-slide-in-right",
            "sm:end-4 sm:bottom-4 sm:start-auto sm:w-96 sm:rounded-2xl sm:max-h-[500px]"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{t('exampleQueries', lang)}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="max-h-[calc(70vh-64px)] sm:max-h-[400px]">
              <div className="p-4 space-y-4">
                {queries.map((section, i) => (
                  <div key={i}>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {section.category}
                    </h4>
                    <div className="space-y-1">
                      {section.queries.map((query, j) => (
                        <button
                          key={j}
                          onClick={() => {
                            onSelectQuery(query);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "w-full text-start px-3 py-2 rounded-lg text-sm",
                            "bg-muted/50 hover:bg-primary/10 transition-colors"
                          )}
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </>
  );
}
