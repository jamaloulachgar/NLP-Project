import type { Language } from './i18n';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: ChatSource[];
  explain?: ExplainData;
}

export interface ChatSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface ExplainData {
  intent: string;
  confidence: number;
  processingTime: number;
  model: string;
  tokens: {
    input: number;
    output: number;
  };
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  explain: ExplainData;
}

// Mock responses based on language
const mockResponses: Record<Language, Record<string, ChatResponse>> = {
  fr: {
    default: {
      answer: "Je suis là pour vous aider avec toutes vos questions concernant la Faculté des Sciences de Rabat. N'hésitez pas à me demander des informations sur les inscriptions, le calendrier académique, les programmes de formation, ou tout autre sujet.",
      sources: [
        { title: "Guide de l'étudiant FSR", url: "https://fsr.ac.ma/guide", snippet: "Guide complet pour les étudiants" },
        { title: "Portail étudiant", url: "https://fsr.ac.ma/portail", snippet: "Accès aux services en ligne" }
      ],
      explain: {
        intent: "general_query",
        confidence: 0.92,
        processingTime: 234,
        model: "gpt-4-turbo",
        tokens: { input: 45, output: 89 }
      }
    },
    calendrier: {
      answer: "Le calendrier académique 2024-2025 comprend:\n\n• **Rentrée universitaire**: 9 septembre 2024\n• **Vacances d'hiver**: 21 décembre 2024 - 5 janvier 2025\n• **Examens S1**: 13 - 24 janvier 2025\n• **Vacances de printemps**: 5 - 13 avril 2025\n• **Examens S2**: 26 mai - 6 juin 2025\n• **Session de rattrapage**: 23 juin - 4 juillet 2025",
      sources: [
        { title: "Calendrier Académique 2024-2025", url: "https://fsr.ac.ma/calendrier", snippet: "Dates officielles de l'année universitaire" }
      ],
      explain: {
        intent: "academic_calendar",
        confidence: 0.98,
        processingTime: 156,
        model: "gpt-4-turbo",
        tokens: { input: 12, output: 145 }
      }
    },
    inscription: {
      answer: "Pour vous inscrire à la FSR, voici les étapes:\n\n1. **Préinscription en ligne** sur le portail Tawjihi\n2. **Dépôt du dossier** comprenant:\n   - Baccalauréat original + copies\n   - Relevés de notes\n   - Photos d'identité (4)\n   - CIN + copie\n3. **Validation** par le service de scolarité\n4. **Paiement des frais** d'inscription\n\n📍 Service de scolarité: Bâtiment A, RDC\n⏰ Horaires: Lundi-Vendredi 9h-12h, 14h-16h",
      sources: [
        { title: "Procédure d'inscription", url: "https://fsr.ac.ma/inscription", snippet: "Guide complet d'inscription" },
        { title: "Documents requis", url: "https://fsr.ac.ma/documents", snippet: "Liste des pièces à fournir" }
      ],
      explain: {
        intent: "registration_process",
        confidence: 0.96,
        processingTime: 189,
        model: "gpt-4-turbo",
        tokens: { input: 15, output: 178 }
      }
    },
    frais: {
      answer: "Les frais d'inscription pour l'année 2024-2025:\n\n• **Licence (L1, L2, L3)**: 200 DH\n• **Master (M1, M2)**: 500 DH\n• **Doctorat**: 1000 DH\n• **Frais d'assurance**: 30 DH\n• **Carte étudiant**: 20 DH\n\n💳 Paiement par:\n- Versement bancaire (CIH)\n- En espèces à la caisse de la faculté",
      sources: [
        { title: "Frais de scolarité", url: "https://fsr.ac.ma/frais", snippet: "Tarifs officiels" }
      ],
      explain: {
        intent: "tuition_fees",
        confidence: 0.97,
        processingTime: 145,
        model: "gpt-4-turbo",
        tokens: { input: 8, output: 132 }
      }
    }
  },
  ar: {
    default: {
      answer: "أنا هنا لمساعدتك في جميع أسئلتك المتعلقة بكلية العلوم بالرباط. لا تتردد في سؤالي عن التسجيلات، التقويم الأكاديمي، برامج التكوين، أو أي موضوع آخر.",
      sources: [
        { title: "دليل الطالب", url: "https://fsr.ac.ma/guide-ar", snippet: "دليل شامل للطلاب" },
        { title: "بوابة الطالب", url: "https://fsr.ac.ma/portail-ar", snippet: "الوصول إلى الخدمات عبر الإنترنت" }
      ],
      explain: {
        intent: "general_query",
        confidence: 0.92,
        processingTime: 234,
        model: "gpt-4-turbo",
        tokens: { input: 45, output: 89 }
      }
    },
    calendrier: {
      answer: "التقويم الأكاديمي 2024-2025:\n\n• **الدخول الجامعي**: 9 سبتمبر 2024\n• **عطلة الشتاء**: 21 ديسمبر 2024 - 5 يناير 2025\n• **امتحانات الفصل الأول**: 13 - 24 يناير 2025\n• **عطلة الربيع**: 5 - 13 أبريل 2025\n• **امتحانات الفصل الثاني**: 26 مايو - 6 يونيو 2025\n• **الدورة الاستدراكية**: 23 يونيو - 4 يوليوز 2025",
      sources: [
        { title: "التقويم الأكاديمي", url: "https://fsr.ac.ma/calendrier-ar", snippet: "التواريخ الرسمية للسنة الجامعية" }
      ],
      explain: {
        intent: "academic_calendar",
        confidence: 0.98,
        processingTime: 156,
        model: "gpt-4-turbo",
        tokens: { input: 12, output: 145 }
      }
    }
  },
  en: {
    default: {
      answer: "I'm here to help you with all your questions about the Faculty of Sciences Rabat. Feel free to ask me about registration, academic calendar, training programs, or any other topic.",
      sources: [
        { title: "Student Guide FSR", url: "https://fsr.ac.ma/guide-en", snippet: "Complete guide for students" },
        { title: "Student Portal", url: "https://fsr.ac.ma/portal", snippet: "Access to online services" }
      ],
      explain: {
        intent: "general_query",
        confidence: 0.92,
        processingTime: 234,
        model: "gpt-4-turbo",
        tokens: { input: 45, output: 89 }
      }
    },
    calendar: {
      answer: "Academic Calendar 2024-2025:\n\n• **Academic year start**: September 9, 2024\n• **Winter break**: December 21, 2024 - January 5, 2025\n• **S1 Exams**: January 13 - 24, 2025\n• **Spring break**: April 5 - 13, 2025\n• **S2 Exams**: May 26 - June 6, 2025\n• **Catch-up session**: June 23 - July 4, 2025",
      sources: [
        { title: "Academic Calendar 2024-2025", url: "https://fsr.ac.ma/calendar-en", snippet: "Official dates for the academic year" }
      ],
      explain: {
        intent: "academic_calendar",
        confidence: 0.98,
        processingTime: 156,
        model: "gpt-4-turbo",
        tokens: { input: 12, output: 145 }
      }
    }
  }
};

function detectIntent(message: string, lang: Language): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('calendrier') || lowerMessage.includes('calendar') || lowerMessage.includes('تقويم') || lowerMessage.includes('date')) {
    return 'calendrier';
  }
  if (lowerMessage.includes('inscription') || lowerMessage.includes('registration') || lowerMessage.includes('تسجيل') || lowerMessage.includes('inscrire')) {
    return 'inscription';
  }
  if (lowerMessage.includes('frais') || lowerMessage.includes('fees') || lowerMessage.includes('رسوم') || lowerMessage.includes('payer') || lowerMessage.includes('tarif')) {
    return 'frais';
  }
  
  return 'default';
}

export async function sendChatMessage(
  message: string,
  conversationId: string,
  lang: Language
): Promise<ChatResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

  // Try to call the real API first
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId,
        language: lang,
      }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // API not available, use mock response
    console.log('API not available, using mock response');
  }

  // Return mock response
  const intent = detectIntent(message, lang);
  const langResponses = mockResponses[lang] || mockResponses.fr;
  return langResponses[intent] || langResponses.default;
}

// Chat history management
const CHAT_STORAGE_KEY = 'fsr_chat_history';

export function getChatHistory(conversationId: string): ChatMessage[] {
  try {
    const stored = localStorage.getItem(`${CHAT_STORAGE_KEY}_${conversationId}`);
    if (stored) {
      const messages = JSON.parse(stored);
      return messages.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
  return [];
}

export function saveChatHistory(conversationId: string, messages: ChatMessage[]): void {
  try {
    localStorage.setItem(`${CHAT_STORAGE_KEY}_${conversationId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
