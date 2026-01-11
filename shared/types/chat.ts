// Shared Types for Chat System
// Used by frontend, backend, and nlp services

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  explain?: ExplainData;
}

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
  topMatches: TopMatch[];
  decision: 'answer' | 'fallback';
}

export interface TopMatch {
  text: string;
  similarity: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  isPinned: boolean;
  messageCount: number;
}

export interface ChatResponse {
  answer: string;
  lang: 'ar' | 'en';
  sources: Source[];
  explain: ExplainData;
}

export interface ChatRequest {
  message: string;
  conversationId: string;
  language: 'ar' | 'en' | 'fr';
}

export type ChatLanguage = 'ar' | 'en';

