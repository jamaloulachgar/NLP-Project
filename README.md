# University Chatbot System

نظام شات بوت ذكي للجامعة يدعم اللغات العربية والإنجليزية والفرنسية.

## 📁 Project Structure

```
university-chatbot/
│
├── frontend/        # React (Lovable / Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── lib/
│       └── types/
│
├── backend/         # NestJS (API + DB)
│   └── src/
│       ├── modules/
│       ├── controllers/
│       └── services/
│
├── nlp/             # FastAPI (AI / NLP)
│   └── app/
│       ├── models/
│       ├── services/
│       └── api/
│
├── shared/          # Types / Contracts مشتركة
│   └── types/
│       └── chat.ts
│
├── infra/           # Docker / env / deployment
│   └── docker/
│       ├── frontend.Dockerfile
│       ├── backend.Dockerfile
│       └── nlp.Dockerfile
│
├── docs/            # توثيق + عرض الامتحان
│
├── .env.example
├── README.md
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for frontend and backend)
- Python 3.10+ (for NLP service)
- Docker & Docker Compose (optional, for containerized deployment)
- PostgreSQL (for backend database)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd university-chatbot
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Install dependencies**

```bash
# Frontend
cd frontend
npm install

# Backend (when created)
cd ../backend
npm install

# NLP (when created)
cd ../nlp
pip install -r requirements.txt
```

4. **Run with Docker Compose (Recommended)**

```bash
docker-compose up -d
```

5. **Or run services individually**

```bash
# Frontend
cd frontend
npm run dev

# Backend (when created)
cd backend
npm run start:dev

# NLP (when created)
cd nlp
uvicorn app.main:app --reload
```

## 🏗️ Architecture

### Frontend (React/Vite)
- **Port**: 8080
- **Tech Stack**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Features**: 
  - Bilingual UI (Arabic/English/French)
  - Chat interface with conversation management
  - Real-time messaging
  - Explain panel for AI decisions

### Backend (NestJS)
- **Port**: 3000
- **Tech Stack**: NestJS, TypeScript, PostgreSQL, Prisma
- **Features**:
  - RESTful API
  - Authentication & Authorization
  - Conversation management
  - Database operations
  - Integration with NLP service

### NLP Service (FastAPI)
- **Port**: 8000
- **Tech Stack**: FastAPI, Python, Transformers, FAISS
- **Features**:
  - Intent classification
  - Language detection
  - Semantic search (LaBSE embeddings)
  - Response generation
  - Explain metadata

## 📚 Documentation

See the [docs/](./docs/) directory for:
- API documentation
- Architecture diagrams
- Deployment guides
- Exam presentation materials

## 🔧 Development

### Shared Types

Types are defined in `shared/types/` and should be used across all services:

```typescript
import { Message, Conversation, ChatResponse } from '@/shared/types';
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

- Database connection strings
- API URLs
- JWT secrets
- Model paths

## 🐳 Docker

### Build and run all services

```bash
docker-compose up --build
```

### Run specific service

```bash
docker-compose up frontend
docker-compose up backend
docker-compose up nlp
```

### Stop all services

```bash
docker-compose down
```

## 📝 License

[Add your license here]

## 👥 Contributors

[Add contributors here]

