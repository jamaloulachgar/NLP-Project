import { Language } from '@/types/chat';

export const translations = {
  en: {
    // Header
    appName: 'Student Services',
    subtitle: 'University Assistant',
    
    // Sidebar
    conversations: 'Conversations',
    yourConversations: 'Your conversations',
    newChat: 'New Chat',
    searchConversations: 'Search conversations...',
    pinned: 'Pinned',
    recent: 'Recent',
    noConversations: 'No conversations yet',
    startNewChat: 'Start a new chat to get help',
    
    // Chat
    typeMessage: 'Type your question...',
    send: 'Send',
    typing: 'Assistant is typing...',
    noMessages: 'Start a conversation',
    askAnything: 'Ask me anything about university services',
    sources: 'Sources',
    explain: 'Explain',
    
    // Quick actions
    academicCalendar: 'Academic Calendar',
    admissions: 'Admissions',
    fees: 'Fees & Payments',
    events: 'Events',
    contact: 'Contact Us',
    
    // Explain panel
    explainMode: 'Explain Mode',
    explainPanel: 'Decision Inspector',
    detectedLang: 'Detected Language',
    ruleHit: 'Rule Hit',
    intent: 'Intent',
    confidence: 'Confidence',
    retrievalMethod: 'Retrieval Method',
    topMatches: 'Top Matches',
    decision: 'Decision',
    yes: 'Yes',
    no: 'No',
    answer: 'Answer',
    fallback: 'Fallback',
    
    // Help
    help: 'Help',
    exampleQueries: 'Example Queries',
    close: 'Close',
    
    // States
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    
    // Time
    justNow: 'Just now',
    minutesAgo: 'm ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
  },
  ar: {
    // Header
    appName: 'خدمات الطلاب',
    subtitle: 'المساعد الجامعي',
    
    // Sidebar
    conversations: 'المحادثات',
    yourConversations: 'محادثاتك',
    newChat: 'محادثة جديدة',
    searchConversations: 'البحث في المحادثات...',
    pinned: 'المثبتة',
    recent: 'الأخيرة',
    noConversations: 'لا توجد محادثات',
    startNewChat: 'ابدأ محادثة جديدة للحصول على المساعدة',
    
    // Chat
    typeMessage: 'اكتب سؤالك...',
    send: 'إرسال',
    typing: 'المساعد يكتب...',
    noMessages: 'ابدأ المحادثة',
    askAnything: 'اسألني أي شيء عن خدمات الجامعة',
    sources: 'المصادر',
    explain: 'شرح',
    
    // Quick actions
    academicCalendar: 'التقويم الأكاديمي',
    admissions: 'القبول',
    fees: 'الرسوم والمدفوعات',
    events: 'الفعاليات',
    contact: 'اتصل بنا',
    
    // Explain panel
    explainMode: 'وضع الشرح',
    explainPanel: 'مفتش القرار',
    detectedLang: 'اللغة المكتشفة',
    ruleHit: 'تطابق القاعدة',
    intent: 'النية',
    confidence: 'الثقة',
    retrievalMethod: 'طريقة الاسترجاع',
    topMatches: 'أفضل التطابقات',
    decision: 'القرار',
    yes: 'نعم',
    no: 'لا',
    answer: 'إجابة',
    fallback: 'احتياطي',
    
    // Help
    help: 'مساعدة',
    exampleQueries: 'أمثلة على الأسئلة',
    close: 'إغلاق',
    
    // States
    loading: 'جاري التحميل...',
    error: 'حدث خطأ ما',
    retry: 'إعادة المحاولة',
    
    // Time
    justNow: 'الآن',
    minutesAgo: 'د',
    hoursAgo: 'س',
    daysAgo: 'ي',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key];
}

export function getDirection(lang: Language): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}
