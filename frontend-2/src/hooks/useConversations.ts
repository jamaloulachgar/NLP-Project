import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';
import { 
  listConversations, 
  createConversation, 
  getMessages, 
  sendMessage as apiSendMessage,
  deleteConversation,
  togglePinConversation 
} from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export function useConversations() {
  const { lang } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const convs = await listConversations();
      setConversations(convs);
      setError(null);
    } catch (e) {
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    try {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      setError(null);
    } catch (e) {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = useCallback(async () => {
    try {
      const newConv = await createConversation();
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(newConv.id);
      setMessages([]);
      return newConv;
    } catch (e) {
      setError('Failed to create conversation');
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    let convId = currentConversationId;
    
    // Create new conversation if none selected
    if (!convId) {
      const newConv = await startNewConversation();
      if (!newConv) return;
      convId = newConv.id;
    }

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const response = await apiSendMessage(convId, text, lang);
      
      // Refresh messages and conversations
      await loadMessages(convId);
      await loadConversations();
      setError(null);
    } catch (e) {
      setError('Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setIsSending(false);
    }
  }, [currentConversationId, lang, startNewConversation]);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const removeConversation = useCallback(async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConversationId === id) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (e) {
      setError('Failed to delete conversation');
    }
  }, [currentConversationId]);

  const pinConversation = useCallback(async (id: string) => {
    try {
      const updated = await togglePinConversation(id);
      setConversations(prev => 
        prev.map(c => c.id === id ? updated : c)
      );
    } catch (e) {
      setError('Failed to update conversation');
    }
  }, []);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const pinnedConversations = conversations.filter(c => c.isPinned);
  const recentConversations = conversations.filter(c => !c.isPinned);

  return {
    conversations,
    pinnedConversations,
    recentConversations,
    currentConversation,
    currentConversationId,
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    selectConversation,
    startNewConversation,
    removeConversation,
    pinConversation,
    retry: loadConversations,
  };
}
