import { ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { mockNews } from '@/lib/mockData';
import type { NewsItem } from '@/types';

const categoryColors: Record<NewsItem['category'], string> = {
  announcement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  research: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  event: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  achievement: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const categoryLabels: Record<string, Record<NewsItem['category'], string>> = {
  fr: {
    announcement: 'Annonce',
    research: 'Recherche',
    event: 'Événement',
    achievement: 'Distinction',
  },
  ar: {
    announcement: 'إعلان',
    research: 'بحث',
    event: 'فعالية',
    achievement: 'تميز',
  },
  en: {
    announcement: 'Announcement',
    research: 'Research',
    event: 'Event',
    achievement: 'Achievement',
  },
};

export function NewsSection() {
  const { lang } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('section.news', lang)}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.news.subtitle', lang)}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {mockNews.slice(0, 6).map((news) => (
            <article
              key={news.id}
              className="group bg-card rounded-2xl overflow-hidden card-elevated flex flex-col"
            >
              {/* Image */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title[lang]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge
                  className={`absolute top-4 left-4 ${categoryColors[news.category]}`}
                >
                  {categoryLabels[lang][news.category]}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={news.date}>{formatDate(news.date)}</time>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title[lang]}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                  {news.excerpt[lang]}
                </p>
                <Link
                  to="#"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-4 group/link"
                >
                  {t('common.readMore', lang)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
