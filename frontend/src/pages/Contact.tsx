import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatbotButton } from '@/components/ChatbotButton';
import { ChatbotModal } from '@/components/ChatbotModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { lang } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(lang === 'ar' ? 'تم إرسال الرسالة!' : lang === 'en' ? 'Message sent!' : 'Message envoyé!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenChatbot={() => setIsChatbotOpen(true)} />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t('contact.title', lang)}</h1>
          <div className="grid lg:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div><label className="block text-sm font-medium mb-2">{t('contact.form.name', lang)}</label><Input required /></div>
              <div><label className="block text-sm font-medium mb-2">{t('contact.form.email', lang)}</label><Input type="email" required /></div>
              <div><label className="block text-sm font-medium mb-2">{t('contact.form.subject', lang)}</label><Input required /></div>
              <div><label className="block text-sm font-medium mb-2">{t('contact.form.message', lang)}</label><Textarea rows={5} required /></div>
              <Button type="submit" size="lg">{t('contact.form.submit', lang)}</Button>
            </form>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">{t('contact.info.title', lang)}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="flex items-start gap-3"><MapPin className="h-5 w-5 mt-0.5 text-primary" />{t('footer.address', lang)}</p>
                <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><span dir="ltr">{t('footer.phone', lang)}</span></p>
                <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" />{t('footer.email', lang)}</p>
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-2"><Clock className="h-4 w-4" />{t('contact.hours', lang)}</h3>
                <p className="text-sm text-muted-foreground">{t('contact.hours.weekdays', lang)}</p>
                <p className="text-sm text-muted-foreground">{t('contact.hours.saturday', lang)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Contact;
