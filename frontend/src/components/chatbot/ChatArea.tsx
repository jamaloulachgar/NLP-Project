import { useRef, useEffect, useState } from 'react';
import { Send, Menu, Sparkles } from 'lucide-react';
import { Message, ChatLanguage } from '@/types/chat';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import { TypingIndicator } from './TypingIndicator';

interface ChatAreaProps {
  messages: Message[];
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onExplainMessage: (message: Message) => void;
  onToggleSidebar: () => void;
  onToggleExplainPanel: () => void;
  showExplainPanel: boolean;
}

export function ChatArea({
  messages,
  isSending,
  onSendMessage,
  onExplainMessage,
  onToggleSidebar,
  onToggleExplainPanel,
  showExplainPanel,
}: ChatAreaProps) {
  const { lang } = useLanguage();
  const chatLang: ChatLanguage = lang === 'ar' ? 'ar' : 'en';
  const [inputValue, setInputValue] = useState('');
  const [inputRows, setInputRows] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && !isSending) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      setInputRows(1);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    // Auto-adjust rows when input value changes
    if (inputRef.current) {
      const textarea = inputRef.current;
      const lines = inputValue.split('\n').length;
      const scrollHeight = textarea.scrollHeight;
      
      // Calculate rows: 1 → 2 → 3 → 4 (max)
      let newRows = 1;
      if (lines >= 2 || scrollHeight > 60) {
        newRows = 2;
      }
      if (lines >= 3 || scrollHeight > 80) {
        newRows = 3;
      }
      if (lines >= 4 || scrollHeight > 100) {
        newRows = 4;
      }
      
      setInputRows(newRows);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleQuickAction = (text: string) => {
    onSendMessage(text);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Minimal header for mobile */}
      <header className="lg:hidden flex items-center px-4 py-3 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#F3F6FB] pb-32">
        {!hasMessages ? (
          <EmptyState lang={chatLang} onQuickAction={handleQuickAction} />
        ) : (
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                onExplain={() => onExplainMessage(message)}
                showExplain={showExplainPanel && message.role === 'assistant'}
                onRegenerate={message.role === 'assistant' && index === messages.length - 1 ? () => {
                  // Regenerate last assistant message
                  if (messages.length > 1) {
                    const lastUserMessage = messages[messages.length - 2];
                    if (lastUserMessage.role === 'user') {
                      onSendMessage(lastUserMessage.content);
                    }
                  }
                } : undefined}
              />
            ))}
            {isSending && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Floating Input area with backdrop blur */}
      <div className="fixed bottom-0 start-0 end-0 pointer-events-none z-40 lg:end-auto lg:start-[calc(320px+(100%-320px)/4)] lg:w-[calc((100%-320px)/2)] ">
        {/* Backdrop blur overlay */}
        <div className="absolute inset-0 bg-[#F3F6FB]/60  -z-10 rounded-3xl shadow-2xl shadow-[#F3F6FB]/20" />
        
        <div className="w-full p-4 pointer-events-auto relative">
          <form onSubmit={handleSubmit}>
            <div className={cn(
              "relative flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-xl shadow-[#F3F6FB]/20 border border-border/30 transition-all duration-300",
              inputRows === 1 ? "rounded-full p-1.5" : "rounded-2xl p-2"
            )}>
              {/* Input field */}
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.typeMessage', lang)}
                rows={inputRows}
                className={cn(
                  "flex-1 resize-none bg-transparent border-none outline-none",
                  "px-4 text-sm min-h-[40px] max-h-[120px]",
                  "placeholder:text-muted-foreground",
                  "overflow-y-auto",
                  "leading-[1.5rem]"
                )}
                style={{ 
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  lineHeight: '1.5rem',
                  verticalAlign: 'middle'
                }}
                disabled={isSending}
              />
              
              {/* Send button with gradient */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className={cn(
                  "w-10 h-10 rounded-full shrink-0 flex items-center justify-center",
                  "transition-all duration-200 shadow-md",
                  inputValue.trim() && !isSending
                    ? "bg-gradient-to-r from-[#3B82F6] to-[#5662F6] hover:from-[#2563EB] hover:to-[#434DDB] text-white shadow-lg"
                    : "bg-gradient-to-r from-[#3B82F6] to-[#5662F6] hover:from-[#2563EB] hover:to-[#434DDB] text-white shadow-lg cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ lang, onQuickAction }: { lang: ChatLanguage; onQuickAction: (text: string) => void }) {
  const displayLang = lang === 'ar' ? 'ar' : 'en';
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#5662F6]/10 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-[#5662F6]" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{t('chat.noMessages', displayLang)}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">{t('chat.askAnything', displayLang)}</p>
      <QuickActions onAction={onQuickAction} centered />
    </div>
  );
}

