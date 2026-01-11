import { ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

interface HeroSectionProps {
  onOpenChatbot: () => void;
}

export function HeroSection({ onOpenChatbot }: HeroSectionProps) {
  const { lang } = useLanguage();

  const scrollToPrograms = () => {
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5 section-pattern" />
      
      {/* Animated Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/90 text-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {lang === 'ar' ? 'جامعة محمد الخامس بالرباط' : lang === 'en' ? 'Mohammed V University Rabat' : 'Université Mohammed V de Rabat'}
          </div>

          {/* Title */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight"
          >
            {t('hero.title', lang)}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-light">
            {t('hero.subtitle', lang)}
          </p>

          {/* Description */}
          <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {t('hero.description', lang)}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="hero"
              size="xl"
              onClick={scrollToPrograms}
              className="w-full sm:w-auto"
            >
              {t('hero.cta.discover', lang)}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              onClick={onOpenChatbot}
              className="w-full sm:w-auto"
            >
              <MessageSquare className="h-5 w-5" />
              {t('hero.cta.chatbot', lang)}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-2.5 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
