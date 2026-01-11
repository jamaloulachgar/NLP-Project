// API Client for Backend Communication
// Frontend ONLY calls the backend API, never the NLP service directly

import { Conversation, Message, ChatResponse, ChatLanguage } from '@/types/chat';

// Get API base URL from environment variable
// In production, this should be set in Vercel: https://your-backend.onrender.com/api
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Storage keys for local storage (fallback)
const CONVERSATIONS_KEY = 'chatbot_conversations';
const MESSAGES_KEY = 'chatbot_messages';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// LocalStorage helpers (fallback when backend is unavailable)
function getStoredConversations(): Conversation[] {
  const stored = localStorage.getItem(CONVERSATIONS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored).map((c: Conversation) => ({
      ...c,
      updatedAt: new Date(c.updatedAt),
    }));
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

function getStoredMessages(): Message[] {
  const stored = localStorage.getItem(MESSAGES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored).map((m: Message) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

// API client functions
export async function createConversation(): Promise<Conversation> {
  try {
    const response = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Backend unavailable, using local storage');
  }
  
  // Fallback to local storage
  const conversations = getStoredConversations();
  const newConversation: Conversation = {
    id: generateId(),
    title: 'New Conversation',
    lastMessage: '',
    updatedAt: new Date(),
    isPinned: false,
    messageCount: 0,
  };
  
  conversations.unshift(newConversation);
  saveConversations(conversations);
  return newConversation;
}

export async function listConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch(`${API_BASE}/conversations`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Backend unavailable, using local storage');
  }
  
  return getStoredConversations();
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Backend unavailable, using local storage');
  }
  
  const allMessages = getStoredMessages();
  return allMessages.filter(m => m.conversationId === conversationId);
}

export async function sendMessage(
  conversationId: string,
  text: string,
  preferredLang: ChatLanguage
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        conversationId,
        language: preferredLang === 'ar' ? 'ar' : preferredLang === 'en' ? 'en' : 'fr',
      }),
    });
    
    if (response.ok) {
      const chatResponse = await response.json();
      
      // Store messages locally as backup
      const allMessages = getStoredMessages();
      const userMessage: Message = {
        id: generateId(),
        conversationId,
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      const assistantMessage: Message = {
        id: generateId(),
        conversationId,
        role: 'assistant',
        content: chatResponse.answer,
        timestamp: new Date(),
        sources: chatResponse.sources,
        explain: chatResponse.explain,
      };
      allMessages.push(userMessage, assistantMessage);
      saveMessages(allMessages);
      
      return chatResponse;
    }
  } catch (error) {
    console.error('API error:', error);
  }
  
  // Fallback mock response
  throw new Error('Backend service unavailable');
}

export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.warn('Backend unavailable, using local storage');
  }
  
  const conversations = getStoredConversations().filter(c => c.id !== conversationId);
  saveConversations(conversations);
  
  const messages = getStoredMessages().filter(m => m.conversationId !== conversationId);
  saveMessages(messages);
}

export async function togglePinConversation(conversationId: string): Promise<Conversation> {
  try {
    const response = await fetch(`${API_BASE}/conversations/${conversationId}/pin`, {
      method: 'POST',
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Backend unavailable, using local storage');
  }
  
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index >= 0) {
    conversations[index].isPinned = !conversations[index].isPinned;
    saveConversations(conversations);
    return conversations[index];
  }
  throw new Error('Conversation not found');
}
