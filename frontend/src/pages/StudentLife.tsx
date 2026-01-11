import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatbotButton } from '@/components/ChatbotButton';
import { ChatbotModal } from '@/components/ChatbotModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { useState } from 'react';
import { Users, Calendar, BookOpen } from 'lucide-react';

const StudentLife = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { lang } = useLanguage();

  const features = [
    { icon: Users, title: { fr: 'Clubs & Associations', ar: 'الأندية والجمعيات', en: 'Clubs & Associations' }, desc: { fr: 'Plus de 20 clubs actifs', ar: 'أكثر من 20 نادي نشط', en: 'Over 20 active clubs' } },
    { icon: Calendar, title: { fr: 'Événements', ar: 'الفعاليات', en: 'Events' }, desc: { fr: 'Conférences et activités', ar: 'مؤتمرات وأنشطة', en: 'Conferences and activities' } },
    { icon: BookOpen, title: { fr: 'Ressources', ar: 'الموارد', en: 'Resources' }, desc: { fr: 'Bibliothèque et espaces', ar: 'مكتبة ومساحات', en: 'Library and study spaces' } },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenChatbot={() => setIsChatbotOpen(true)} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t('nav.studentLife', lang)}</h1>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card rounded-xl p-6 card-elevated text-center">
                <f.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{f.title[lang]}</h3>
                <p className="text-sm text-muted-foreground">{f.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default StudentLife;
