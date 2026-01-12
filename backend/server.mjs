import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import fs from 'node:fs';

const PORT = Number(process.env.PORT || 3000);
const NLP_SERVICE_URL = (process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8001').replace(/\/$/, '');

// In-memory store
const conversations = new Map();
const messagesByConversation = new Map();

const id = () => Math.random().toString(36).slice(2, 10);

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  });
  res.end(payload);
}

function noContent(res, status = 204) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  });
  res.end();
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

function ensureConversation(conversationId) {
  if (conversations.has(conversationId)) return conversations.get(conversationId);
  const conv = {
    id: conversationId,
    title: 'New Conversation',
    lastMessage: '',
    updatedAt: new Date(),
    isPinned: false,
    messageCount: 0,
  };
  conversations.set(conversationId, conv);
  messagesByConversation.set(conversationId, []);
  return conv;
}

function listConversations() {
  return Array.from(conversations.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function appendMessage(msg) {
  const list = messagesByConversation.get(msg.conversationId) || [];
  list.push(msg);
  messagesByConversation.set(msg.conversationId, list);

  const c = conversations.get(msg.conversationId);
  if (c) {
    c.lastMessage = String(msg.content || '').slice(0, 140);
    c.updatedAt = new Date();
    c.messageCount = list.length;
    conversations.set(msg.conversationId, c);
  }
}

async function nlpChat({ message, conversationId, language }) {
  const endpoint = new URL(`${NLP_SERVICE_URL}/api/chat`);
  const payload = JSON.stringify({ message, conversationId, language });
  const client = endpoint.protocol === 'https:' ? https : http;

  return await new Promise((resolve, reject) => {
    const req = client.request(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          const status = res.statusCode || 0;
          if (status < 200 || status >= 300) {
            return reject(new Error(`NLP error ${status}: ${raw}`));
          }
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`Invalid JSON from NLP: ${raw.slice(0, 200)}`));
          }
        });
      },
    );

    req.on('error', reject);
    req.setTimeout(30_000, () => req.destroy(new Error('NLP request timeout')));
    req.write(payload);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const path = u.pathname;
    const method = req.method || 'GET';

    if (method === 'OPTIONS') return noContent(res, 204);

    // Simple demo UI (no React / no npm install)
    if (method === 'GET' && (path === '/' || path === '/chat')) {
      const filePath = new URL('./public/chat.html', import.meta.url);
      const html = fs.readFileSync(filePath, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      });
      return res.end(html);
    }

    if (method === 'GET' && path === '/api/health') {
      return json(res, 200, { ok: true, nlp: NLP_SERVICE_URL });
    }

    if (method === 'POST' && path === '/api/conversations') {
      const conv = {
        id: id(),
        title: 'New Conversation',
        lastMessage: '',
        updatedAt: new Date(),
        isPinned: false,
        messageCount: 0,
      };
      conversations.set(conv.id, conv);
      messagesByConversation.set(conv.id, []);
      return json(res, 200, conv);
    }

    if (method === 'GET' && path === '/api/conversations') {
      return json(res, 200, listConversations());
    }

    const msgMatch = path.match(/^\/api\/conversations\/([^/]+)\/messages$/);
    if (method === 'GET' && msgMatch) {
      const convId = decodeURIComponent(msgMatch[1]);
      return json(res, 200, messagesByConversation.get(convId) || []);
    }

    const pinMatch = path.match(/^\/api\/conversations\/([^/]+)\/pin$/);
    if (method === 'POST' && pinMatch) {
      const convId = decodeURIComponent(pinMatch[1]);
      const c = conversations.get(convId);
      if (!c) return json(res, 404, { error: 'Not found' });
      c.isPinned = !c.isPinned;
      c.updatedAt = new Date();
      conversations.set(convId, c);
      return json(res, 200, c);
    }

    const delMatch = path.match(/^\/api\/conversations\/([^/]+)$/);
    if (method === 'DELETE' && delMatch) {
      const convId = decodeURIComponent(delMatch[1]);
      conversations.delete(convId);
      messagesByConversation.delete(convId);
      return noContent(res, 204);
    }

    if (method === 'POST' && path === '/api/chat') {
      const body = await readJson(req);
      const message = body?.message;
      const conversationId = body?.conversationId;
      const language = body?.language || 'en';

      if (!message || !conversationId) {
        return json(res, 400, { error: 'message and conversationId are required' });
      }

      ensureConversation(conversationId);
      appendMessage({
        id: id(),
        conversationId,
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      try {
        const chat = await nlpChat({ message, conversationId, language });
        appendMessage({
          id: id(),
          conversationId,
          role: 'assistant',
          content: chat.answer,
          timestamp: new Date(),
          sources: chat.sources,
          explain: chat.explain,
        });
        return json(res, 200, chat);
      } catch (e) {
        return json(res, 502, {
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
        });
      }
    }

    return json(res, 404, { error: 'Not found' });
  } catch (e) {
    return json(res, 500, { error: String(e?.message || e) });
  }
});

server.listen(PORT, () => {
  console.log(`Backend (no-deps) listening on http://127.0.0.1:${PORT}/api`);
  console.log(`Using NLP_SERVICE_URL=${NLP_SERVICE_URL}`);
});




