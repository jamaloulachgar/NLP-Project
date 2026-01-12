# Backend (NestJS)

Backend API service for the University Chatbot system.

## Setup

```bash
npm install
```

## Development

```bash
npm run start:dev
```

## Production

```bash
npm run build
npm run start:prod
```

## Low disk space mode (no npm install)

If you get `ENOSPC: no space left on device` on Windows, you can still run a minimal backend **without installing any node_modules**:

```bat
cd backend
set NLP_SERVICE_URL=http://127.0.0.1:8001
node server.mjs
```

This provides the same endpoints used by the frontend:
- `POST /api/chat`
- `GET/POST /api/conversations`
- `GET /api/conversations/:id/messages`
- `DELETE /api/conversations/:id`
- `POST /api/conversations/:id/pin`

## Features

- RESTful API
- Authentication & Authorization
- Conversation management
- Database integration (PostgreSQL)
- NLP service integration

## API Endpoints

- `POST /api/chat` - Send chat message
- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id/messages` - Get messages
- `DELETE /api/conversations/:id` - Delete conversation

