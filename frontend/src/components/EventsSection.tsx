import { Calendar, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { mockEvents } from '@/lib/mockData';
import type { Event } from '@/types';

const typeColors: Record<Event['type'], string> = {
  conference: 'bg-blue-500',
  seminar: 'bg-purple-500',
  workshop: 'bg-green-500',
  ceremony: 'bg-amber-500',
};

export function EventsSection() {
  const { lang } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR', {
        month: 'short',
      }).format(date),
    };
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30 section-pattern">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('section.events', lang)}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.events.subtitle', lang)}
          </p>
        </div>

        {/* Events List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {mockEvents.map((event, index) => {
            const { day, month } = formatDate(event.date);
            return (
              <div
                key={event.id}
                className="bg-card rounded-xl p-4 md:p-6 card-elevated flex gap-4 md:gap-6 items-start fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Date Badge */}
                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary flex flex-col items-center justify-center text-primary-foreground">
                  <span className="text-2xl md:text-3xl font-bold leading-none">{day}</span>
                  <span className="text-xs md:text-sm font-medium uppercase opacity-80">{month}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${typeColors[event.type]}`} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {event.title[lang]}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description[lang]}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
