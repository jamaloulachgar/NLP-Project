import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatbotButton } from '@/components/ChatbotButton';
import { ChatbotModal } from '@/components/ChatbotModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { mockLabs } from '@/lib/mockData';
import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

const Research = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenChatbot={() => setIsChatbotOpen(true)} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t('section.research', lang)}</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLabs.map(lab => (
              <div key={lab.id} className="bg-card rounded-xl p-6 card-elevated">
                <FlaskConical className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{lab.name[lang]}</h3>
                <p className="text-sm text-muted-foreground mb-4">{lab.description[lang]}</p>
                <p className="text-xs text-muted-foreground mb-2">Director: {lab.director}</p>
                <div className="flex flex-wrap gap-1">
                  {lab.researchAreas[lang].map((area, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary rounded text-xs">{area}</span>
                  ))}
                </div>
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

export default Research;
