import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatbotButton } from '@/components/ChatbotButton';
import { ChatbotModal } from '@/components/ChatbotModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { useState } from 'react';

const About = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenChatbot={() => setIsChatbotOpen(true)} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t('about.title', lang)}</h1>
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground">
              {lang === 'fr' && "La Faculté des Sciences de Rabat (FSR) est un établissement d'enseignement supérieur fondé en 1959. Elle fait partie de l'Université Mohammed V de Rabat."}
              {lang === 'ar' && "كلية العلوم بالرباط هي مؤسسة للتعليم العالي تأسست عام 1959. وهي جزء من جامعة محمد الخامس بالرباط."}
              {lang === 'en' && "The Faculty of Sciences Rabat (FSR) is a higher education institution founded in 1959. It is part of Mohammed V University in Rabat."}
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default About;
