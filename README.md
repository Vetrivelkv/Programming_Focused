# Programming Focused

A full-stack programming learning and assessment project scaffolded from the
same architecture and technology stack as the sibling `Complete_English`
project.

## Technology stack

- React 19 and Vite 6 frontend
- Node.js 22 and Express 4 backend
- RethinkDB persistence through `rethinkdbdash`
- HTTP-only JWT session cookies
- Docker and Railway deployment configuration
- GitHub Actions continuous integration

## Project structure

```text
Programming_Focused/
├── backend/
│   ├── data/                 # Curriculum and question-bank data
│   ├── docker/rethinkdb/     # Local database image
│   ├── src/
│   │   ├── config/           # RethinkDB connection
│   │   ├── init/             # Database initialization
│   │   ├── lib/              # Shared server helpers
│   │   ├── logic/            # Authentication and course logic
│   │   ├── models/           # Persistence models
│   │   └── routes/           # REST API routes
│   └── docker-compose.yml
├── frontend/
│   ├── public/assets/        # Lesson artwork
│   └── src/
│       ├── components/       # Shared React components
│       └── pages/            # Routed pages
├── .github/workflows/ci.yml  # CI verification
├── deploy/railway/           # Railway setup and variable template
├── Dockerfile
└── railway.json
```

## Run locally

Prerequisites: Node.js 22+, npm, and Docker Desktop.

```powershell
docker compose -f backend/docker-compose.yml up -d
Copy-Item backend/.env.example backend/.env
npm run install:all
npm run dev
```

Open `http://localhost:5173`. The RethinkDB administration page is available
at `http://localhost:39080`.

## Validate

```powershell
npm run check
```

This runs backend syntax checks, frontend linting, and a production frontend
build. See [`deploy/railway/README.md`](deploy/railway/README.md) for deployment
setup.
