import { useEffect, useRef, useState } from 'react';
import { Users, FlaskConical, BookOpen, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { stats } from '@/lib/mockData';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  label: string;
  delay: number;
}

function StatItem({ icon: Icon, value, label, delay }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-card card-elevated"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}+
      </span>
      <span className="text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export function StatsSection() {
  const { lang } = useLanguage();

  const statsData = [
    { icon: Users, value: stats.students, label: t('stats.students', lang), delay: 0 },
    { icon: FlaskConical, value: stats.labs, label: t('stats.labs', lang), delay: 100 },
    { icon: BookOpen, value: stats.programs, label: t('stats.programs', lang), delay: 200 },
    { icon: GraduationCap, value: stats.professors, label: t('stats.professors', lang), delay: 300 },
  ];

  return (
    <section className="py-16 md:py-20 bg-secondary/30 section-pattern">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsData.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
