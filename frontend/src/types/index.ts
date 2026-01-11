import type { Language } from '@/lib/i18n';

export interface NewsItem {
  id: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  date: string;
  image: string;
  category: 'announcement' | 'research' | 'event' | 'achievement';
}

export interface Event {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  date: string;
  time: string;
  location: string;
  type: 'conference' | 'seminar' | 'workshop' | 'ceremony';
}

export interface Program {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  level: 'licence' | 'master' | 'doctorat';
  department: string;
  duration: string;
  credits?: number;
}

export interface Lab {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  director: string;
  researchAreas: Record<Language, string[]>;
  image?: string;
}

export interface Service {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  link: string;
}
