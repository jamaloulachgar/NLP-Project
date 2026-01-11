import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ChatbotButtonProps {
  onClick: () => void;
}

export function ChatbotButton({ onClick }: ChatbotButtonProps) {
  const { dir } = useLanguage();

  return (
    <Button
      onClick={onClick}
      variant="chatbot"
      size="iconLg"
      className={cn(
        "fixed bottom-6 z-40 rounded-full float-animation",
        dir === 'rtl' ? 'left-6' : 'right-6'
      )}
      aria-label="Open chatbot"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
}
