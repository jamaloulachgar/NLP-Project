import { ExternalLink, User, ThumbsUp, ThumbsDown, Copy, MoreVertical, RotateCcw } from 'lucide-react';
import { Message } from '@/types/chat';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  onExplain: () => void;
  showExplain: boolean;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, onExplain, showExplain, onRegenerate }: MessageBubbleProps) {
  const { lang } = useLanguage();
  const displayLang = lang === 'ar' ? 'ar' : 'en';
  const isUser = message.role === 'user';
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbsUp = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleThumbsDown = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <div className={cn(
      "flex gap-3 message-enter",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser ? "bg-[#5662F6]" : "bg-[#5662F6]/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <span className="text-xs font-semibold text-[#5662F6]">AI</span>
        )}
      </div>

      {/* Content */}
      <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-2xl px-4 py-3",
          isUser 
            ? "bg-[#5662F6] text-white rounded-te-md" 
            : "bg-white text-foreground rounded-ts-md"
        )}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="my-1">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ps-4">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 ps-4">{children}</ol>,
                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#5662F6] underline hover:no-underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('chat.sources', displayLang)}
            </h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                      "bg-secondary text-secondary-foreground text-xs font-medium",
                      "hover:bg-[#5662F6]/10 transition-colors"
                    )}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Interaction buttons - only for assistant messages */}
        {!isUser && (
          <div className="flex items-center justify-between gap-4 mt-3">
            {/* Thumbs up/down, Copy, Menu */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-1 py-0.5">
              <button
                onClick={handleThumbsUp}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  isLiked ? "text-[#3B82F6]" : "text-muted-foreground hover:text-foreground"
                )}
                title="Like"
              >
                <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
              </button>
              
              <div className="w-px h-4 bg-border" />
              
              <button
                onClick={handleThumbsDown}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  isDisliked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                )}
                title="Dislike"
              >
                <ThumbsDown className={cn("w-4 h-4", isDisliked && "fill-current")} />
              </button>
              
              <div className="w-px h-4 bg-border" />
              
              <button
                onClick={handleCopy}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                )}
                title={copied ? "Copied!" : "Copy"}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            
            {/* More options button (separate) */}
            <button
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {/* Regenerate button */}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors ml-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

