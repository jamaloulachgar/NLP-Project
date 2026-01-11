# Frontend (React + Vite)

Frontend application for the University Chatbot system.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Frontend runs on `http://localhost:8080`

## Production Build

```bash
npm run build
```

Output directory: `dist/`

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL
  - Development: `http://localhost:3000/api`
  - Production: Set in Vercel dashboard

## Deployment (Vercel)

1. Connect Git repository to Vercel
2. Set root directory to `frontend/`
3. Add environment variable: `VITE_API_BASE_URL`
4. Deploy automatically on push

See [docs/deployment.md](../docs/deployment.md) for detailed instructions.

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── app/         # App structure (router, layout)
│   ├── pages/       # Page components
│   ├── components/  # React components
│   │   ├── navbar/
│   │   ├── footer/
│   │   └── chatbot/
│   ├── lib/         # Utilities (api.ts, i18n.ts)
│   ├── types/       # TypeScript types
│   └── styles/      # Global styles
├── vercel.json      # Vercel configuration
└── package.json
```

## Important Notes

- **Calls Backend Only** - Frontend never calls NLP service directly
- **SPA Routing** - Uses React Router with Vercel rewrites
- **RTL Support** - Full Arabic/French/English support
- **Environment Variables** - Must be prefixed with `VITE_`
