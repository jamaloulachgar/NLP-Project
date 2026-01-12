import fetch from 'node-fetch';

export interface NlpChatResponse {
  answer: string;
  lang: 'ar' | 'en';
  sources: Array<{ title: string; url: string; type: 'official' | 'faq' | 'policy' }>;
  explain: {
    detectedLang: 'ar' | 'en';
    ruleHit: boolean;
    intent: string;
    intentConfidence: number;
    retrievalMethod: 'tfidf' | 'labse';
    topMatches: Array<{ text: string; similarity: number }>;
    decision: 'answer' | 'fallback';
  };
}

export async function nlpChat(params: {
  message: string;
  conversationId: string;
  language: 'ar' | 'en' | 'fr';
}): Promise<NlpChatResponse> {
  const base = (process.env.NLP_SERVICE_URL || 'http://localhost:8000').replace(/\/$/, '');
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NLP error ${res.status}: ${text}`);
  }
  return (await res.json()) as NlpChatResponse;
}






