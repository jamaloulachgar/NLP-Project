// Home Page (renamed from Index)
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { NewsSection } from '@/components/NewsSection';
import { EventsSection } from '@/components/EventsSection';
import { ProgramsSection } from '@/components/ProgramsSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ChatbotButton, ChatbotModal } from '@/components/chatbot';

const Home = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenChatbot={() => setIsChatbotOpen(true)} />
      
      <main className="flex-1">
        <HeroSection onOpenChatbot={() => setIsChatbotOpen(true)} />
        <StatsSection />
        <NewsSection />
        <ProgramsSection />
        <EventsSection />
        <ServicesSection />
      </main>

      <Footer />
      
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Home;

