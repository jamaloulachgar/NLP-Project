import { Calendar, GraduationCap, CreditCard, CalendarDays, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onAction: (text: string) => void;
  centered?: boolean;
}

const actions = [
  { key: 'academicCalendar', icon: Calendar, query: { en: 'When does the semester start?', ar: 'متى يبدأ الفصل الدراسي؟' } },
  { key: 'admissions', icon: GraduationCap, query: { en: 'How do I apply for admission?', ar: 'كيف أقدم على القبول؟' } },
  { key: 'fees', icon: CreditCard, query: { en: 'What are the tuition fees?', ar: 'ما هي الرسوم الدراسية؟' } },
  { key: 'events', icon: CalendarDays, query: { en: 'What events are happening this month?', ar: 'ما هي الفعاليات هذا الشهر؟' } },
  { key: 'contact', icon: Phone, query: { en: 'How can I contact student services?', ar: 'كيف أتواصل مع خدمات الطلاب؟' } },
] as const;

export function QuickActions({ onAction, centered }: QuickActionsProps) {
  const { lang } = useLanguage();
  const displayLang = lang === 'ar' ? 'ar' : 'en';
  const chatLang = lang === 'ar' ? 'ar' : 'en';

  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      centered ? "justify-center" : "justify-start"
    )}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.key}
            onClick={() => onAction(action.query[chatLang])}
            className={cn(
              "quick-action inline-flex items-center gap-2 px-3 py-2 rounded-full",
              "bg-secondary text-secondary-foreground text-sm font-medium",
              "hover:bg-primary hover:text-primary-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{t(`chat.${action.key}`, displayLang)}</span>
          </button>
        );
      })}
    </div>
  );
}

