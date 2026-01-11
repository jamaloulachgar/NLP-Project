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

