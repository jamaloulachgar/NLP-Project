import { ArrowRight, GraduationCap, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { mockPrograms } from '@/lib/mockData';

const levelIcons = {
  licence: GraduationCap,
  master: BookOpen,
  doctorat: Award,
};

const levelColors = {
  licence: 'from-blue-500 to-blue-600',
  master: 'from-purple-500 to-purple-600',
  doctorat: 'from-amber-500 to-amber-600',
};

export function ProgramsSection() {
  const { lang } = useLanguage();

  // Get 2 programs per level for preview
  const programsByLevel = {
    licence: mockPrograms.filter((p) => p.level === 'licence').slice(0, 2),
    master: mockPrograms.filter((p) => p.level === 'master').slice(0, 2),
    doctorat: mockPrograms.filter((p) => p.level === 'doctorat').slice(0, 1),
  };

  const levels = [
    { key: 'licence', label: t('program.licence', lang), count: 15 },
    { key: 'master', label: t('program.master', lang), count: 22 },
    { key: 'doctorat', label: t('program.doctorat', lang), count: 8 },
  ] as const;

  return (
    <section id="programs" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('section.programs', lang)}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.programs.subtitle', lang)}
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {levels.map((level, index) => {
            const Icon = levelIcons[level.key];
            return (
              <div
                key={level.key}
                className="relative bg-card rounded-2xl p-6 card-elevated overflow-hidden group fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${levelColors[level.key]}`}
                />

                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${levelColors[level.key]} flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{level.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {level.count} {lang === 'ar' ? 'برنامج' : lang === 'en' ? 'programs' : 'programmes'}
                    </p>
                  </div>
                </div>

                {/* Programs preview */}
                <ul className="space-y-2 mb-4">
                  {programsByLevel[level.key].map((program) => (
                    <li
                      key={program.id}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {program.title[lang]}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/programs"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium group/link"
                >
                  {t('common.viewDetails', lang)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/programs">
              {t('program.viewAll', lang)}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
