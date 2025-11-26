# 🐳 Docker Setup - Quick Start Guide

## ⚡ Quick Reference

| When | Command |
|------|---------|
| **First time** | `docker compose up --build -d` |
| **Daily use (no code changes)** | `docker compose up -d` |
| **After code changes** | `docker compose up --build -d` |
| **Check status** | `docker compose ps` |
| **Stop** | `docker compose stop` or `docker compose down` |

**💡 Tip:** Only use `--build` when you've changed code. For regular use, `docker compose up -d` is faster!

---

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)

## Step-by-Step Instructions

### 🆕 First Time Setup (Only Once)

#### Step 1: Start Docker Desktop
1. Open Docker Desktop application
2. Wait until it shows "Docker Desktop is running" (whale icon in system tray)

#### Step 2: Navigate to Project Directory
```bash
cd "D:\From desk\IUL\4th Year\PLANT THING\Smart-Plant-Monitor"
```

#### Step 3: Build and Start All Services (First Time)
```bash
docker compose up --build -d
```

**This builds the containers and starts everything. Takes a few minutes the first time.**

---

### 🚀 Daily Use (Every Time After First Setup)

**For regular use (when you haven't changed code):**
```bash
docker compose up -d
```

**That's it!** No need for `--build` unless you changed code.

**Or even simpler - if containers are already running:**
```bash
# Just check if they're running
docker compose ps

# If stopped, start them:
docker compose start
```

**⚠️ When to use `--build`:**
- ✅ First time setup
- ✅ After changing code files (Python, HTML, CSS, JS)
- ✅ After changing Dockerfiles
- ✅ After updating requirements.txt or dependencies
- ❌ **NOT needed** for regular daily use (just `docker compose up -d`)

**To stop (when done):**
```bash
docker compose stop
# or
docker compose down
```

**What this does:**
- Builds all containers (database, backend, frontend)
- Starts all services in detached mode (`-d` means run in background)
- Creates MySQL database automatically
- Sets up all connections

### Step 4: Verify Services Are Running
```bash
docker compose ps
```

**Expected output:**
- ✅ `smart-plant-db` - Healthy
- ✅ `smart-plant-backend` - Up
- ✅ `smart-plant-frontend` - Up

### Step 5: Access the Application

**Frontend (Dashboard):**
- URL: http://localhost:3000
- Or: http://127.0.0.1:3000

**Backend API:**
- URL: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Database:**
- Port: 3307 (mapped from container's 3306)

---

## Useful Commands

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs backend -f
docker compose logs frontend -f
docker compose logs db -f
```

### Stop Services
```bash
docker compose down
```

### Stop and Remove Volumes (deletes database data)
```bash
docker compose down -v
```

### Restart Services
```bash
docker compose restart
```

### Rebuild After Code Changes
```bash
docker compose up --build -d
```

### Check Service Status
```bash
docker compose ps
```

---

## Troubleshooting

### ❌ Error: "cannot find the file specified" or "dockerDesktopLinuxEngine"
**Error message:**
```
unable to get image 'smart-plant-monitor-frontend': error during connect: 
Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/...": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

**Solution:**
1. **Open Docker Desktop** - Make sure Docker Desktop application is running
2. **Wait for it to fully start** - Look for the whale icon in your system tray (bottom right)
3. **Check Docker Desktop status** - It should show "Docker Desktop is running"
4. **Verify Docker is ready:**
   ```bash
   docker ps
   ```
   If this works, Docker is ready. If you get the same error, Docker Desktop isn't fully started yet.
5. **Restart Docker Desktop** if needed:
   - Right-click the Docker icon in system tray
   - Click "Restart Docker Desktop"
   - Wait 30-60 seconds for it to fully start
6. **Try again:**
   ```bash
   docker compose up -d
   ```

### Port Already in Use
If port 8000 or 3000 is already in use:
1. Stop the service using that port
2. Or change ports in `docker-compose.yml`

### Database Connection Issues
- Make sure Docker Desktop is running
- Check database is healthy: `docker compose ps`
- View database logs: `docker compose logs db`

### Frontend Not Loading
- Hard refresh browser: `Ctrl + F5`
- Check frontend logs: `docker compose logs frontend`
- Verify nginx is running: `docker compose ps`

### Backend Not Responding
- Check backend logs: `docker compose logs backend`
- Verify backend is up: `docker compose ps`
- Test API: `curl http://localhost:8000/dashboard`

---

## Quick Reference

| Service | Container Name | Port | URL |
|---------|---------------|------|-----|
| Frontend | smart-plant-frontend | 3000 | http://localhost:3000 |
| Backend | smart-plant-backend | 8000 | http://localhost:8000 |
| Database | smart-plant-db | 3307 | localhost:3307 |

---

## Environment Variables (Docker)

Docker uses environment variables from `docker-compose.yml`:
- `MYSQL_USER=root`
- `MYSQL_PASSWORD=mary098`
- `MYSQL_HOST=db` (service name in Docker network)
- `MYSQL_PORT=3306` (internal container port)
- `MYSQL_DB=smart_plant_db`

**Note:** Docker containers don't use `.env` files - they use `docker-compose.yml` environment variables.

