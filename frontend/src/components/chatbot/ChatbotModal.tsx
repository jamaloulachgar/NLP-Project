import { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronDown, ChevronUp, ExternalLink, Loader2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { sendChatMessage, getChatHistory, saveChatHistory, generateConversationId, type ChatMessage } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const { lang, dir } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [conversationId] = useState(() => generateConversationId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    { key: 'calendar', label: t('chatbot.chip.calendar', lang) },
    { key: 'registration', label: t('chatbot.chip.registration', lang) },
    { key: 'fees', label: t('chatbot.chip.fees', lang) },
    { key: 'events', label: t('chatbot.chip.events', lang) },
    { key: 'contact', label: t('chatbot.chip.contact', lang) },
  ];

  useEffect(() => {
    if (isOpen) {
      const history = getChatHistory(conversationId);
      if (history.length === 0) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: t('chatbot.welcome', lang),
          timestamp: new Date(),
        }]);
      } else {
        setMessages(history);
      }
    }
  }, [isOpen, conversationId, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 1) {
      saveChatHistory(conversationId, messages);
    }
  }, [messages, conversationId]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageText, conversationId, lang);
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
        explain: response.explain,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant' && m.explain);

  const handleOpenFullPage = () => {
    onClose();
    navigate('/chat');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative w-full max-w-lg h-[85vh] sm:h-[600px] bg-card rounded-2xl shadow-chatbot flex flex-col overflow-hidden animate-scale-in",
          dir === 'rtl' && 'font-arabic'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-lg">🎓</span>
            </div>
            <div>
              <h2 className="font-semibold">{t('chatbot.title', lang)}</h2>
              <p className="text-xs opacity-80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {t('chatbot.status', lang)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenFullPage}
              className="text-primary-foreground hover:bg-primary-foreground/10"
              title={t('chatbot.openFullPage', lang)}
              aria-label={t('chatbot.openFullPage', lang)}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-secondary-foreground rounded-bl-md'
              )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-secondary-foreground/10">
                    <p className="text-xs font-medium mb-2 opacity-70">{t('chatbot.sources', lang)}</p>
                    <div className="space-y-1">
                      {message.sources.map((source, i) => (
                        <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" />
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Explain Panel */}
        {lastAssistantMessage?.explain && (
          <div className="border-t">
            <button onClick={() => setShowExplain(!showExplain)} className="w-full px-4 py-2 flex items-center justify-between text-xs text-muted-foreground hover:bg-muted/50">
              <span>{t('chatbot.explain', lang)}</span>
              {showExplain ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
            {showExplain && (
              <div className="px-4 pb-3 text-xs text-muted-foreground space-y-1 bg-muted/30">
                <p>Intent: {lastAssistantMessage.explain.intent}</p>
                <p>Confidence: {(lastAssistantMessage.explain.confidence * 100).toFixed(0)}%</p>
                <p>Model: {lastAssistantMessage.explain.model}</p>
                <p>Tokens: {lastAssistantMessage.explain.tokens.input} in / {lastAssistantMessage.explain.tokens.output} out</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Chips */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t">
          {quickChips.map((chip) => (
            <button key={chip.key} onClick={() => handleSend(chip.label)} disabled={isLoading} className="shrink-0 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50">
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={t('chatbot.placeholder', lang)} disabled={isLoading} className="flex-1" />
          <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
