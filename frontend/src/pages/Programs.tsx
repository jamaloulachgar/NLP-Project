import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ChatbotButton, ChatbotModal } from '@/components/chatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { mockPrograms } from '@/lib/mockData';
import { useState } from 'react';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

const levelIcons = { licence: GraduationCap, master: BookOpen, doctorat: Award };

const Programs = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const { lang } = useLanguage();

  const filtered = filter === 'all' ? mockPrograms : mockPrograms.filter(p => p.level === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenChatbot={() => setIsChatbotOpen(true)} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t('section.programs', lang)}</h1>
          <div className="flex gap-2 mb-8 flex-wrap">
            {['all', 'licence', 'master', 'doctorat'].map(level => (
              <button key={level} onClick={() => setFilter(level)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === level ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                {level === 'all' ? (lang === 'ar' ? 'الكل' : lang === 'en' ? 'All' : 'Tous') : t(`program.${level}`, lang)}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(program => {
              const Icon = levelIcons[program.level];
              return (
                <div key={program.id} className="bg-card rounded-xl p-6 card-elevated">
                  <Icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{program.title[lang]}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{program.description[lang]}</p>
                  <p className="text-xs text-muted-foreground">{program.duration} • {program.department}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Programs;
