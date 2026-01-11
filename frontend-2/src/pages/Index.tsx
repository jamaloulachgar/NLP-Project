import { useState } from 'react';
import { Message } from '@/types/chat';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useConversations } from '@/hooks/useConversations';
import { ConversationsSidebar } from '@/components/ConversationsSidebar';
import { ChatArea } from '@/components/ChatArea';
import { ExplainPanel } from '@/components/ExplainPanel';
import { HelpPanel } from '@/components/HelpPanel';
import { LanguageToggle } from '@/components/LanguageToggle';

function ChatApp() {
  const {
    pinnedConversations,
    recentConversations,
    currentConversationId,
    messages,
    isSending,
    sendMessage,
    selectConversation,
    startNewConversation,
    removeConversation,
    pinConversation,
  } = useConversations();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [explainPanelOpen, setExplainPanelOpen] = useState(false);
  const [selectedExplainMessage, setSelectedExplainMessage] = useState<Message | null>(null);

  const handleExplainMessage = (message: Message) => {
    setSelectedExplainMessage(message);
    setExplainPanelOpen(true);
  };

  const handleSendFromHelp = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative bg-[#F3F6FB]">
      {/* Left sidebar - Fixed position */}
      <ConversationsSidebar
        pinnedConversations={pinnedConversations}
        recentConversations={recentConversations}
        currentConversationId={currentConversationId}
        onSelectConversation={(id) => {
          selectConversation(id);
          setSidebarOpen(false);
        }}
        onNewConversation={() => {
          startNewConversation();
          setSidebarOpen(false);
        }}
        onDeleteConversation={removeConversation}
        onPinConversation={pinConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onClearAll={() => {
          // Clear all conversations
          const allIds = [...pinnedConversations, ...recentConversations].map(c => c.id);
          allIds.forEach(id => removeConversation(id));
        }}
      />

      {/* Main chat area - with left margin on desktop to account for fixed sidebar */}
      <main className="flex-1 min-w-0 relative lg:ms-[320px] ">
        <ChatArea
          messages={messages}
          isSending={isSending}
          onSendMessage={sendMessage}
          onExplainMessage={handleExplainMessage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleExplainPanel={() => setExplainPanelOpen(!explainPanelOpen)}
          showExplainPanel={explainPanelOpen}
        />
        
        {/* Help panel */}
        <HelpPanel onSelectQuery={handleSendFromHelp} />
      </main>

      {/* Right explain panel */}
      <ExplainPanel
        isOpen={explainPanelOpen}
        onClose={() => setExplainPanelOpen(false)}
        message={selectedExplainMessage}
      />

      {/* Language toggle - fixed position */}
      <div className="fixed top-4 end-4 z-30">
        <LanguageToggle />
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <LanguageProvider>
      <ChatApp />
    </LanguageProvider>
  );
}
