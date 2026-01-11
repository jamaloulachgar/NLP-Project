# University Student Services Chatbot UI

A bilingual (Arabic/English) chatbot interface for university student services built with React, TypeScript, and Tailwind CSS.

## Features

- **Bilingual Support**: Full Arabic (RTL) and English (LTR) support with seamless switching
- **3-Column Layout**: Conversations sidebar, chat area, and explain panel
- **Conversation Management**: Create, search, pin, and delete conversations with localStorage persistence
- **Markdown Support**: Rich text rendering in assistant messages
- **Sources Display**: Clickable links to official university resources
- **Explain Inspector**: Debug panel showing NLP decision metadata (intent, confidence, retrieval method)
- **Quick Actions**: Pre-defined topic chips for common queries
- **Help Panel**: Example queries organized by category
- **Responsive Design**: Desktop-first with mobile-friendly slide-over panels

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Query ready (API client prepared)

## Running the UI

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The UI will be available at `http://localhost:5173`

## API Endpoints Expected

The UI is prepared to connect to a NestJS backend with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message and receive response (NestJS forwards to FastAPI NLP) |
| GET | `/api/conversations` | List user conversations |
| POST | `/api/conversations` | Create new conversation |
| GET | `/api/conversations/:id/messages` | Get messages for a conversation |
| DELETE | `/api/conversations/:id` | Delete a conversation |

### Expected Response Format (POST /api/chat)

```json
{
  "answer": "Response text with **markdown** support",
  "lang": "en",
  "sources": [
    {
      "title": "Academic Calendar",
      "url": "https://university.edu/calendar",
      "type": "official"
    }
  ],
  "explain": {
    "detectedLang": "en",
    "ruleHit": true,
    "intent": "academic_inquiry",
    "intentConfidence": 0.92,
    "retrievalMethod": "labse",
    "topMatches": [
      { "text": "Match preview...", "similarity": 0.89 }
    ],
    "decision": "answer"
  }
}
```

## Project Structure

```
src/
├── components/
│   ├── ChatArea.tsx        # Main chat thread and input
│   ├── ConversationsSidebar.tsx  # Left sidebar with conversation list
│   ├── ExplainPanel.tsx    # Right panel with NLP decision details
│   ├── HelpPanel.tsx       # Floating help with example queries
│   ├── LanguageToggle.tsx  # AR/EN language switcher
│   ├── MessageBubble.tsx   # Individual message with sources
│   ├── QuickActions.tsx    # Topic suggestion chips
│   └── TypingIndicator.tsx # Loading animation
├── contexts/
│   └── LanguageContext.tsx # i18n state management
├── hooks/
│   └── useConversations.ts # Conversation state & API integration
├── lib/
│   ├── api.ts              # API client with mock data
│   ├── i18n.ts             # Translation dictionary
│   └── utils.ts            # Utility functions
├── pages/
│   └── Index.tsx           # Main page layout
└── types/
    └── chat.ts             # TypeScript interfaces
```

## Customization

### Colors
Edit `src/index.css` to modify the design system. Key variables:
- `--primary`: Deep teal brand color
- `--accent`: Warm amber highlights
- `--chat-user` / `--chat-assistant`: Message bubble colors

### Translations
Add or modify translations in `src/lib/i18n.ts`
