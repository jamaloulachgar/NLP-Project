export type Role = 'user' | 'assistant';

export interface Source {
  title: string;
  url: string;
  type: 'official' | 'faq' | 'policy';
}

export interface ExplainData {
  detectedLang: 'ar' | 'en';
  ruleHit: boolean;
  intent: string;
  intentConfidence: number;
  retrievalMethod: 'tfidf' | 'labse';
  topMatches: Array<{ text: string; similarity: number }>;
  decision: 'answer' | 'fallback';
}

export interface Message {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  timestamp: Date;
  sources?: Source[];
  explain?: ExplainData;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  isPinned: boolean;
  messageCount: number;
}

const conversations = new Map<string, Conversation>();
const messagesByConversation = new Map<string, Message[]>();

const id = () => Math.random().toString(36).slice(2, 10);

export function createConversation(): Conversation {
  const conv: Conversation = {
    id: id(),
    title: 'New Conversation',
    lastMessage: '',
    updatedAt: new Date(),
    isPinned: false,
    messageCount: 0,
  };
  conversations.set(conv.id, conv);
  messagesByConversation.set(conv.id, []);
  return conv;
}

export function listConversations(): Conversation[] {
  return Array.from(conversations.values()).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );
}

export function togglePinConversation(conversationId: string): Conversation | null {
  const c = conversations.get(conversationId);
  if (!c) return null;
  c.isPinned = !c.isPinned;
  c.updatedAt = new Date();
  conversations.set(conversationId, c);
  return c;
}

export function deleteConversation(conversationId: string): void {
  conversations.delete(conversationId);
  messagesByConversation.delete(conversationId);
}

export function getMessages(conversationId: string): Message[] {
  return messagesByConversation.get(conversationId) ?? [];
}

export function appendMessage(msg: Message): void {
  const list = messagesByConversation.get(msg.conversationId) ?? [];
  list.push(msg);
  messagesByConversation.set(msg.conversationId, list);

  const c = conversations.get(msg.conversationId);
  if (c) {
    c.lastMessage = msg.content.slice(0, 140);
    c.updatedAt = new Date();
    c.messageCount = list.length;
    conversations.set(msg.conversationId, c);
  }
}

export function ensureConversation(conversationId: string): Conversation {
  const c = conversations.get(conversationId);
  if (c) return c;
  const created = createConversation();
  // keep requested id (so frontend keeps stable IDs)
  conversations.delete(created.id);
  messagesByConversation.delete(created.id);
  const conv: Conversation = { ...created, id: conversationId };
  conversations.set(conversationId, conv);
  messagesByConversation.set(conversationId, []);
  return conv;
}







