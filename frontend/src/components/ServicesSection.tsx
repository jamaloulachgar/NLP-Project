import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Users, 
  BookOpen,
  LucideIcon
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { mockServices } from '@/lib/mockData';

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  FileText,
  GraduationCap,
  Calendar,
  Users,
  BookOpen,
};

export function ServicesSection() {
  const { lang } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-secondary/30 section-pattern">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('section.services', lang)}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.services.subtitle', lang)}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockServices.map((service, index) => {
            const Icon = iconMap[service.icon] || FileText;
            return (
              <Link
                key={service.id}
                to={service.link}
                className="group bg-card rounded-xl p-4 md:p-6 card-elevated flex flex-col items-center text-center fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {service.name[lang]}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 hidden md:block">
                  {service.description[lang]}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
