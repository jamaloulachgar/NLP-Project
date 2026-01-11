import { Plus, Search, Pin, MessageSquare, Trash2, Edit, Settings, MoreVertical, X, User, Home, ArrowLeft } from 'lucide-react';
import { Conversation, ChatLanguage } from '@/types/chat';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConversationsSidebarProps {
  pinnedConversations: Conversation[];
  recentConversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onPinConversation: (id: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  onClearAll?: () => void;
}

export function ConversationsSidebar({
  pinnedConversations,
  recentConversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onPinConversation,
  isOpen,
  onClose,
  onClearAll,
}: ConversationsSidebarProps) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const displayLang = lang === 'ar' ? 'ar' : 'en';
  const chatLang: ChatLanguage = lang === 'ar' ? 'ar' : 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const filterConversations = (convs: Conversation[]) => {
    if (!searchQuery.trim()) return convs;
    return convs.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPinned = filterConversations(pinnedConversations);
  const filteredRecent = filterConversations(recentConversations);
  const hasConversations = pinnedConversations.length > 0 || recentConversations.length > 0;
  
  // Separate recent conversations into "Your conversations" and "Last 7 Days"
  const yourConversations = [...filteredPinned, ...filteredRecent];
  const last7Days: Conversation[] = [];

  return (
    <aside
      className={cn(
        "flex flex-col bg-white rounded-xl shadow-xl shadow-[#F3F6FB]/20 m-4",
        "w-[320px] shrink-0",
        "fixed inset-y-0 start-0 z-50",
        "transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 rounded-3xl shadow-2xl shadow-[#F3F6FB]/20 m-4"
      )}
    >
      {/* Header with Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">CHAT A.I+</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-lg hover:bg-muted transition-colors"
            title={t('nav.home', lang)}
            aria-label={t('nav.home', lang)}
          >
            <Home className="w-5 h-5 text-foreground" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onNewConversation}
            className="flex-1 bg-[#5662F6] hover:bg-[#434DDB] text-white rounded-full h-11 gap-2 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t('chat.newChat', displayLang)}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 rounded-full bg-black hover:bg-black/90 text-white shrink-0"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        {!hasConversations ? (
          <div className="p-6 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t('chat.noConversations', displayLang)}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{t('chat.startNewChat', displayLang)}</p>
          </div>
        ) : (
          <div className="p-2">
            {/* Your conversations */}
            {yourConversations.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="text-sm font-medium text-foreground">
                    {t('chat.yourConversations', displayLang)}
                  </h3>
                  {onClearAll && (
                    <button
                    onClick={onClearAll}
                    className="text-xs text-[#5662F6] hover:text-[#434DDB] font-medium"
                  >
                    Clear All
                  </button>
                  )}
                </div>
                <ConversationList
                  conversations={yourConversations}
                  currentId={currentConversationId}
                  onSelect={onSelectConversation}
                  onDelete={onDeleteConversation}
                  onPin={onPinConversation}
                  lang={chatLang}
                />
              </div>
            )}

            {/* Last 7 Days */}
            {last7Days.length > 0 && (
              <div className="mt-4">
                <div className="border-t border-border my-2" />
                <h3 className="px-3 py-2 text-sm font-medium text-foreground">
                  Last 7 Days
                </h3>
                <ConversationList
                  conversations={last7Days}
                  currentId={currentConversationId}
                  onSelect={onSelectConversation}
                  onDelete={onDeleteConversation}
                  onPin={onPinConversation}
                  lang={chatLang}
                />
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer - Settings and User Profile */}
      <div className="border-t border-border p-3 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-foreground hover:bg-muted rounded-full border border-[#F5F5F5] hover:border-[#E5E5E5] hover:text-[#5662F6] p-2"
        >
          <div className="flex items-center gap-3 w-8 h-8 bg-[#5662F6]/10 rounded-full justify-center">
            <Settings className=" text-[#5662F6]" />
          </div>
            <span>Settings</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-foreground hover:bg-muted rounded-full border border-[#F5F5F5] hover:border-[#E5E5E5] hover:text-[#5662F6] p-2"
        >
          <div className="flex items-center gap-3 w-8 h-8 bg-[#5662F6]/10 rounded-full justify-center">
            <User className=" text-[#5662F6]" />
          </div>
            <span>User Profile</span>
        </Button>
      </div>

      {/* Mobile overlay close */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </aside>
  );
}

interface ConversationListProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  lang: ChatLanguage;
}

function ConversationList({ conversations, currentId, onSelect, onDelete, onPin, lang }: ConversationListProps) {
  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === currentId}
          onSelect={() => onSelect(conv.id)}
          onDelete={() => onDelete(conv.id)}
          onPin={() => onPin(conv.id)}
          lang={lang}
        />
      ))}
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onPin: () => void;
  lang: ChatLanguage;
}

function ConversationItem({ conversation, isActive, onSelect, onDelete, onPin, lang }: ConversationItemProps) {
  const [showActions, setShowActions] = useState(false);
  const displayLang = lang === 'ar' ? 'ar' : 'en';

  return (
    <div
      className={cn(
        "group relative rounded-lg cursor-pointer transition-colors px-3 py-2.5",
        isActive 
          ? "bg-[#5662F6]/12" 
          : "hover:bg-muted/50"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        {/* Chat bubble icon */}
        <MessageSquare className={cn(
          "w-4 h-4 shrink-0",
          isActive ? "text-[#5662F6]" : "text-muted-foreground"
        )} />
        
        {/* Title */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-sm truncate",
            isActive ? "text-[#5662F6] font-medium" : "text-foreground"
          )}>
            {conversation.title || t('chat.newChat', displayLang)}
          </h4>
        </div>

        {/* Action buttons - only show when active or hovered */}
        {(isActive || showActions) && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded hover:bg-muted transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Edit functionality
              }}
              className="p-1.5 rounded hover:bg-muted transition-colors"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            {isActive && (
              <div className="w-2 h-2 rounded-full bg-[#5662F6] shrink-0" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

