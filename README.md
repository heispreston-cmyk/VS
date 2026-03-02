# VendSwipe NG 🇳🇬 — Docker Setup

## Files
```
vendswipe-docker/
├── Dockerfile          ← Main container definition
├── nginx.conf          ← Nginx PWA config
├── docker-compose.yml  ← Easy local dev
├── index.html          ← The VendSwipe NG app
└── .dockerignore
```

## Quick Start

### Option 1 — Docker only
```bash
# Build
docker build -t vendswipe-ng .

# Run
docker run -p 8080:80 vendswipe-ng

# Open in browser
http://localhost:8080
```

### Option 2 — Docker Compose (easier)
```bash
docker-compose up
# Open → http://localhost:8080

# Stop
docker-compose down
```

## Deploy to Cloud (Free)

### Railway.app (Easiest)
1. Push this folder to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Select the repo → auto-detects Dockerfile → live URL in 2 minutes

### Fly.io
```bash
fly launch
fly deploy
```

### Render.com
1. Push to GitHub
2. New Web Service → connect repo → Docker → Deploy

### DigitalOcean App Platform
1. Push to GitHub
2. New App → GitHub → Dockerfile detected → Deploy
