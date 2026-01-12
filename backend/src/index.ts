import express from 'express';
import cors from 'cors';

import { nlpChat } from './nlpClient.js';
import {
  appendMessage,
  createConversation,
  deleteConversation,
  ensureConversation,
  getMessages,
  listConversations,
  togglePinConversation,
  type Message,
} from './store.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT || 3000);

const genId = () => Math.random().toString(36).slice(2, 10);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/conversations', (_req, res) => {
  const conv = createConversation();
  res.json(conv);
});

app.get('/api/conversations', (_req, res) => {
  res.json(listConversations());
});

app.get('/api/conversations/:id/messages', (req, res) => {
  res.json(getMessages(req.params.id));
});

app.delete('/api/conversations/:id', (req, res) => {
  deleteConversation(req.params.id);
  res.status(204).send();
});

app.post('/api/conversations/:id/pin', (req, res) => {
  const updated = togglePinConversation(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

app.post('/api/chat', async (req, res) => {
  const { message, conversationId, language } = req.body as {
    message?: string;
    conversationId?: string;
    language?: 'ar' | 'en' | 'fr';
  };

  if (!message || !conversationId) {
    return res.status(400).json({ error: 'message and conversationId are required' });
  }

  ensureConversation(conversationId);

  const userMsg: Message = {
    id: genId(),
    conversationId,
    role: 'user',
    content: message,
    timestamp: new Date(),
  };
  appendMessage(userMsg);

  try {
    const chat = await nlpChat({
      message,
      conversationId,
      language: language || 'en',
    });

    const assistantMsg: Message = {
      id: genId(),
      conversationId,
      role: 'assistant',
      content: chat.answer,
      timestamp: new Date(),
      sources: chat.sources,
      explain: chat.explain,
    };
    appendMessage(assistantMsg);

    return res.json(chat);
  } catch (e: any) {
    return res.status(502).json({
      answer:
        language === 'ar'
          ? 'الخدمة الذكية غير متاحة حالياً. حاول لاحقاً.'
          : 'NLP service is unavailable right now. Please try again later.',
      lang: language === 'ar' ? 'ar' : 'en',
      sources: [],
      explain: {
        detectedLang: language === 'ar' ? 'ar' : 'en',
        ruleHit: false,
        intent: 'error',
        intentConfidence: 0,
        retrievalMethod: 'tfidf',
        topMatches: [],
        decision: 'fallback',
      },
      error: String(e?.message || e),
    });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API listening on http://localhost:${PORT}/api`);
});






