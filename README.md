# RadarUA

RadarUA is a production-oriented Telegram Mini App for approximate realtime visualization of public air-threat data in Ukraine. It uses a React/Vite frontend, a FastAPI backend, Leaflet maps, WebSocket streaming, Docker, and Nginx.

> Safety notice: RadarUA intentionally displays approximate, delayed, public-source visualization only. It is not designed for targeting, tactical coordination, or operational military precision.

## Stack

- Frontend: React, Vite, TypeScript, TailwindCSS, Framer Motion, Leaflet, Zustand, Axios
- Backend: Python, FastAPI, aiohttp, Pydantic, WebSockets, async services
- Deployment: Docker, Docker Compose, Nginx

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Services:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Production Nginx: http://localhost:8080

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## API

- `GET /health` service health
- `GET /api/current` normalized current feed
- `GET /api/objects` normalized objects only
- `GET /api/stats` aggregate threat statistics
- `WS /ws/live` live updates every few seconds

## Telegram Mini App

The frontend loads `https://telegram.org/js/telegram-web-app.js`, expands the app, applies Telegram theme colors where available, and reads `initDataUnsafe` defensively. Production validation of Telegram `initData` should be enabled on the backend once a bot token is provisioned.

## Safety Model

RadarUA applies a conservative visualization layer:

- public API source only
- configurable data delay metadata
- coordinate precision reduction before frontend delivery
- prominent disclaimer in UI
- no targeting controls or tactical recommendation features

## Project Structure

```text
backend/app/
  api/          HTTP routes
  cache/        cache interfaces
  core/         config, logging, errors
  models/       domain models
  schemas/      response schemas
  services/     MAPA client, normalization, stats
  websocket/    live socket manager
frontend/src/
  components/   reusable UI and map components
  hooks/        data and Telegram hooks
  layouts/      app shell
  pages/        screens
  services/     API clients
  store/        Zustand state
  styles/       Tailwind entry
  types/        TypeScript contracts
  utils/        formatting and helpers
```

