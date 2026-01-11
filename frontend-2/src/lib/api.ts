import { Conversation, Message, ChatResponse, Language, Source, ExplainData } from '@/types/chat';

const API_BASE = '/api';

// Storage keys
const CONVERSATIONS_KEY = 'chatbot_conversations';
const MESSAGES_KEY = 'chatbot_messages';

// Mock data for demo
const mockSources: Source[] = [
  { title: 'Academic Calendar 2024-2025', url: 'https://university.edu/calendar', type: 'official' },
  { title: 'Registration Guidelines', url: 'https://university.edu/registration', type: 'policy' },
  { title: 'FAQ - Enrollment', url: 'https://university.edu/faq/enrollment', type: 'faq' },
];

const mockExplain: ExplainData = {
  detectedLang: 'en',
  ruleHit: true,
  intent: 'academic_inquiry',
  intentConfidence: 0.92,
  retrievalMethod: 'labse',
  topMatches: [
    { text: 'The academic calendar lists all important dates...', similarity: 0.89 },
    { text: 'Registration opens two weeks before semester...', similarity: 0.76 },
    { text: 'Students can check their enrollment status...', similarity: 0.71 },
  ],
  decision: 'answer',
};

const mockResponses: Record<string, { en: string; ar: string }> = {
  default: {
    en: "I'd be happy to help you with that! Based on your question, here are the key points:\n\n**Important Information:**\n- Registration for Fall 2025 opens on August 1st\n- All students must complete their course selection by August 15th\n- Late registration fees apply after the deadline\n\nWould you like more specific information about any of these topics?",
    ar: "يسعدني مساعدتك في ذلك! بناءً على سؤالك، إليك النقاط الرئيسية:\n\n**معلومات مهمة:**\n- يفتح التسجيل لخريف 2025 في 1 أغسطس\n- يجب على جميع الطلاب إكمال اختيار المقررات بحلول 15 أغسطس\n- تُطبق رسوم التسجيل المتأخر بعد الموعد النهائي\n\nهل تريد معلومات أكثر تحديداً حول أي من هذه المواضيع؟",
  },
  calendar: {
    en: "**Academic Calendar 2024-2025**\n\n📅 **Fall Semester**\n- Classes begin: September 2, 2024\n- Mid-term exams: October 14-18\n- Final exams: December 9-20\n\n📅 **Spring Semester**\n- Classes begin: January 13, 2025\n- Spring break: March 10-14\n- Final exams: May 5-16\n\nYou can view the full calendar on the university portal.",
    ar: "**التقويم الأكاديمي 2024-2025**\n\n📅 **الفصل الخريفي**\n- بداية الدراسة: 2 سبتمبر 2024\n- امتحانات منتصف الفصل: 14-18 أكتوبر\n- الامتحانات النهائية: 9-20 ديسمبر\n\n📅 **الفصل الربيعي**\n- بداية الدراسة: 13 يناير 2025\n- إجازة الربيع: 10-14 مارس\n- الامتحانات النهائية: 5-16 مايو\n\nيمكنك عرض التقويم الكامل على بوابة الجامعة.",
  },
  fees: {
    en: "**Tuition & Fees Information**\n\n💰 **Undergraduate Fees (per semester)**\n- Tuition: $5,500\n- Student services: $350\n- Technology fee: $150\n\n💳 **Payment Options**\n- Full payment before semester\n- Monthly installment plan (4 payments)\n- Financial aid available for eligible students\n\n📞 Contact the Finance Office for payment plans.",
    ar: "**معلومات الرسوم الدراسية**\n\n💰 **رسوم البكالوريوس (لكل فصل)**\n- الرسوم الدراسية: 5,500 دولار\n- خدمات الطلاب: 350 دولار\n- رسوم التكنولوجيا: 150 دولار\n\n💳 **خيارات الدفع**\n- الدفع الكامل قبل الفصل\n- خطة الأقساط الشهرية (4 دفعات)\n- المساعدات المالية متاحة للطلاب المؤهلين\n\n📞 تواصل مع مكتب المالية لخطط الدفع.",
  },
};

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// LocalStorage helpers
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
  return getStoredConversations();
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const allMessages = getStoredMessages();
  return allMessages.filter(m => m.conversationId === conversationId);
}

export async function sendMessage(
  conversationId: string,
  text: string,
  preferredLang: Language
): Promise<ChatResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
  
  // Store user message
  const allMessages = getStoredMessages();
  const userMessage: Message = {
    id: generateId(),
    conversationId,
    role: 'user',
    content: text,
    timestamp: new Date(),
  };
  allMessages.push(userMessage);
  
  // Determine response based on content
  const lowerText = text.toLowerCase();
  let responseKey = 'default';
  if (lowerText.includes('calendar') || lowerText.includes('تقويم') || lowerText.includes('موعد')) {
    responseKey = 'calendar';
  } else if (lowerText.includes('fee') || lowerText.includes('payment') || lowerText.includes('رسوم') || lowerText.includes('دفع')) {
    responseKey = 'fees';
  }
  
  const response = mockResponses[responseKey];
  const answer = response[preferredLang];
  
  // Create assistant message
  const assistantMessage: Message = {
    id: generateId(),
    conversationId,
    role: 'assistant',
    content: answer,
    timestamp: new Date(),
    sources: mockSources,
    explain: {
      ...mockExplain,
      detectedLang: preferredLang,
      intentConfidence: 0.85 + Math.random() * 0.14,
    },
  };
  allMessages.push(assistantMessage);
  saveMessages(allMessages);
  
  // Update conversation
  const conversations = getStoredConversations();
  const convIndex = conversations.findIndex(c => c.id === conversationId);
  if (convIndex >= 0) {
    conversations[convIndex] = {
      ...conversations[convIndex],
      lastMessage: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      title: conversations[convIndex].messageCount === 0 
        ? text.substring(0, 30) + (text.length > 30 ? '...' : '')
        : conversations[convIndex].title,
      updatedAt: new Date(),
      messageCount: conversations[convIndex].messageCount + 2,
    };
    saveConversations(conversations);
  }
  
  return {
    answer,
    lang: preferredLang,
    sources: mockSources,
    explain: assistantMessage.explain!,
  };
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const conversations = getStoredConversations().filter(c => c.id !== conversationId);
  saveConversations(conversations);
  
  const messages = getStoredMessages().filter(m => m.conversationId !== conversationId);
  saveMessages(messages);
}

export async function togglePinConversation(conversationId: string): Promise<Conversation> {
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index >= 0) {
    conversations[index].isPinned = !conversations[index].isPinned;
    saveConversations(conversations);
    return conversations[index];
  }
  throw new Error('Conversation not found');
}
