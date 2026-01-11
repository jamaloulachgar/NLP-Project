# Infrastructure

This directory contains Docker configurations and deployment files.

## Structure

```
infra/
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nlp.Dockerfile
└── README.md
```

## Docker Files

### Frontend
- Base: Node.js 18 Alpine
- Port: 8080
- Development server with hot reload

### Backend
- Base: Node.js 18 Alpine
- Port: 3000
- NestJS development server

### NLP Service
- Base: Python 3.10 Slim
- Port: 8000
- FastAPI with uvicorn

## Usage

See the main `docker-compose.yml` in the root directory for orchestration.

## Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
docker-compose build nlp
```

