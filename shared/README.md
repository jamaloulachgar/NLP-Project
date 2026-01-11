# Shared Types & Contracts

This directory contains shared TypeScript types and interfaces used across all services (frontend, backend, and nlp).

## Structure

```
shared/
├── types/
│   ├── chat.ts      # Chat-related types (Message, Conversation, etc.)
│   └── index.ts     # Type exports
└── README.md
```

## Usage

### Frontend
```typescript
import { Message, Conversation } from '@/shared/types';
```

### Backend (NestJS)
```typescript
import { Message, Conversation } from '../shared/types';
```

### NLP (FastAPI)
Types should be mirrored in Python using Pydantic models.

## Adding New Types

1. Add the type definition to the appropriate file in `types/`
2. Export it from `types/index.ts`
3. Update this README if needed

