# 🌱 Smart Plant Monitor

A full-stack web application for monitoring plant health through soil moisture tracking. The system provides real-time status evaluation, comprehensive plant management, and an intuitive dashboard interface for tracking multiple plants and their moisture readings.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
  - [Method 1: Docker (Recommended)](#method-1-docker-recommended)
  - [Method 2: Local Development](#method-2-local-development)
- [API Documentation](#-api-documentation)
- [Example API Calls](#-example-api-calls)
- [Running Tests](#-running-tests)
- [Usage](#-usage)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🌿 Plant Management
- **CRUD Operations**: Create, read, update, and delete plants
- **Plant Details**: View comprehensive plant information including species and ideal moisture ranges
- **Auto Status Calculation**: Automatic health status evaluation based on moisture readings

### 💧 Moisture Readings
- **Add Readings**: Record soil moisture measurements for any plant
- **Reading History**: View complete chronological history of all readings
- **Delete Readings**: Remove specific readings as needed
- **Latest Reading Display**: Dashboard shows the most recent reading for each plant

### 📊 Dashboard Analytics
- **Plant Overview**: List all plants with their current status
- **Search & Filter**: Find plants by name or filter by health status
- **Quick Actions**: Direct access to view, edit, and add readings
- **Status Indicators**: Visual indicators for plant health (OK, Needs Water, Overwatered, No Data)

### 🧠 Intelligent Status Engine

The system automatically calculates plant status based on moisture readings:

| Status | Condition |
|--------|-----------|
| `needs_water` | Moisture < ideal_min |
| `overwatered` | Moisture > ideal_max |
| `ok` | ideal_min ≤ Moisture ≤ ideal_max |
| `no_data` | No readings exist for the plant |

---

## 🛠️ Tech Stack

### Backend
- **Python 3.11+** - Core programming language
- **FastAPI** - Modern, high-performance web framework
- **SQLAlchemy** - ORM for database operations
- **PyMySQL** - MySQL database connector
- **Pydantic** - Data validation and settings management
- **Python-dotenv** - Environment variable management
- **Uvicorn** - ASGI server for FastAPI
- **Pytest** - Testing framework

### Database
- **MySQL 8.3** - Relational database management system
- **Automatic Schema Creation** - Tables created on application startup

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - Client-side interactivity
- **Modular Architecture** - Reusable components (header, footer, utilities)
- **RESTful API Integration** - Async API calls for data management

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for frontend (Docker setup)

---

## 📁 Project Structure

```
Smart-Plant-Monitor/
│
├── backend/
│   ├── main.py              # FastAPI application and route definitions
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for request/response validation
│   ├── crud.py              # Database CRUD operations
│   ├── database.py          # Database connection and session management
│   ├── status_logic.py      # Plant status calculation logic
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile.backend   # Backend container configuration
│   └── tests/
│       ├── conftest.py      # Pytest configuration and fixtures
│       ├── test_plants_endpoint.py    # Plant endpoint tests
│       └── test_status_logic.py       # Status logic tests
│
├── frontend/
│   ├── dashboard/
│   │   ├── index.html       # Main dashboard page
│   │   ├── script.js        # Dashboard functionality
│   │   └── style.css        # Dashboard styles
│   ├── plant_form/
│   │   ├── add_plant.html   # Add new plant form
│   │   ├── edit_plant.html  # Edit plant form
│   │   ├── plant_details.html  # Plant details view
│   │   ├── script.js        # Plant form functionality
│   │   └── style.css        # Plant form styles
│   ├── readings/
│   │   ├── add_reading.html # Add moisture reading form
│   │   ├── script.js        # Reading functionality
│   │   └── style.css        # Reading styles
│   ├── shared/
│   │   ├── header.html      # Reusable header component
│   │   ├── footer.html      # Reusable footer component
│   │   ├── utils.js         # Shared utility functions
│   │   └── variables.css    # CSS custom properties
│   ├── index.html           # Landing page
│   ├── Dockerfile.frontend  # Frontend container configuration
│   └── nginx.conf           # Nginx configuration
│
├── docker-compose.yml       # Docker Compose configuration
├── .dockerignore            # Docker ignore patterns
├── .gitignore               # Git ignore patterns
├── DOCKER_SETUP.md          # Detailed Docker setup guide
└── README.md                # This file
```

---

## 🚀 Setup Instructions

You can run this project using either Docker (recommended for easy setup) or local development (for active development).

---

## Method 1: Docker (Recommended)

Docker provides the easiest setup with all services pre-configured and orchestrated automatically.

### Prerequisites
- **Docker Desktop** installed and running
  - Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
  - Ensure Docker Desktop is running (check system tray for whale icon)

### Quick Start

1. **Navigate to project directory:**
   ```bash
   cd Smart-Plant-Monitor
   ```

2. **Build and start all services (first time):**
   ```bash
   docker compose up --build -d
   ```
   This command:
   - Builds Docker images for backend and frontend
   - Creates and starts MySQL database container
   - Starts all services in detached mode
   - Takes 2-5 minutes on first run

3. **Verify services are running:**
   ```bash
   docker compose ps
   ```
   Expected output: All three services (db, backend, frontend) should show as "Up" or "healthy"

4. **Access the application:**
   - **Frontend Dashboard**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation (Swagger)**: http://localhost:8000/docs
   - **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc

### Daily Use Commands

| Task | Command |
|------|---------|
| **Start services** (after first setup) | `docker compose up -d` |
| **Start with rebuild** (after code changes) | `docker compose up --build -d` |
| **Stop services** | `docker compose stop` |
| **Stop and remove containers** | `docker compose down` |
| **View logs** | `docker compose logs -f` |
| **View specific service logs** | `docker compose logs backend -f` |
| **Check status** | `docker compose ps` |
| **Restart services** | `docker compose restart` |

### When to Use `--build` Flag

Use `docker compose up --build -d` when:
- ✅ First time setup
- ✅ After modifying Python, HTML, CSS, or JavaScript files
- ✅ After updating `requirements.txt` or dependencies
- ✅ After modifying Dockerfiles

Use `docker compose up -d` (without `--build`) for:
- ✅ Regular daily use when no code changes were made
- ✅ Faster startup (uses cached images)

### Troubleshooting Docker

**Error: "cannot find the file specified" or "dockerDesktopLinuxEngine"**
- Ensure Docker Desktop is running
- Wait 30-60 seconds after starting Docker Desktop
- Verify with: `docker ps`
- Restart Docker Desktop if needed

**Port already in use:**
- Stop services using ports 3000, 8000, or 3307
- Or modify ports in `docker-compose.yml`

**View detailed logs:**
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

For more detailed Docker setup instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md).

---

## Method 2: Local Development

Local development setup is ideal for active development and debugging.

### Prerequisites
- **Python 3.11+** installed
- **MySQL 8.0+** installed and running
- **MySQL root access** or a user with database creation privileges
- **Web server** (VS Code Live Server extension or Python HTTP server)

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Pluuuuuu/Smart-Plant-Monitor.git
cd Smart-Plant-Monitor
```

#### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

#### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=smart_plant_db
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

#### 5. Create MySQL Database (Optional)

The application will automatically create the database if it doesn't exist, but you can create it manually:

```sql
CREATE DATABASE smart_plant_db;
```

#### 6. Start the Backend Server

From the project root directory:

```bash
uvicorn backend.main:app --reload
```

The backend will be available at:
- **API Base URL**: http://127.0.0.1:8000
- **Interactive API Docs**: http://127.0.0.1:8000/docs
- **Alternative API Docs**: http://127.0.0.1:8000/redoc

The `--reload` flag enables auto-reload on code changes.

#### 7. Start the Frontend

**⚠️ Important:** The frontend **must** be served through a web server. Opening HTML files directly (`file://`) will break API requests due to CORS restrictions.

**Option A: VS Code Live Server (Recommended)**
1. Install the "Live Server" extension in VS Code
2. Open the `frontend` folder in VS Code
3. Right-click on `dashboard/index.html`
4. Select "Open with Live Server"
5. The dashboard will open in your browser

**Option B: Python HTTP Server**
```bash
cd frontend
python -m http.server 5500
```
Then open: http://localhost:5500/dashboard/index.html

**Option C: Node.js HTTP Server**
```bash
cd frontend
npx http-server -p 5500
```

---

## 📚 API Documentation

The API is fully documented using OpenAPI/Swagger. Once the backend is running, access the interactive documentation at:

- **Swagger UI**: http://localhost:8000/docs (Docker) or http://127.0.0.1:8000/docs (Local)
- **ReDoc**: http://localhost:8000/redoc (Docker) or http://127.0.0.1:8000/redoc (Local)

### API Endpoints Overview

#### Plant Endpoints
- `GET /plants` - Get all plants
- `GET /plants/{plant_id}` - Get a specific plant by ID
- `POST /plants` - Create a new plant
- `PUT /plants/{plant_id}` - Update a plant
- `DELETE /plants/{plant_id}` - Delete a plant

#### Reading Endpoints
- `GET /readings/{plant_id}` - Get all readings for a specific plant
- `POST /readings` - Create a new moisture reading
- `DELETE /readings/{reading_id}` - Delete a specific reading

#### Dashboard Endpoint
- `GET /dashboard` - Get dashboard data (all plants with latest readings and status)

---

## 🔧 Example API Calls

### Using cURL

#### Create a New Plant
```bash
curl -X POST http://localhost:8000/plants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aloe Vera",
    "species": "Aloe barbadensis",
    "ideal_moisture_min": 20,
    "ideal_moisture_max": 40
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Aloe Vera",
  "species": "Aloe barbadensis",
  "ideal_moisture_min": 20,
  "ideal_moisture_max": 40
}
```

#### Get All Plants
```bash
curl http://localhost:8000/plants
```

#### Get a Specific Plant
```bash
curl http://localhost:8000/plants/1
```

#### Update a Plant
```bash
curl -X PUT http://localhost:8000/plants/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aloe Vera",
    "species": "Aloe barbadensis",
    "ideal_moisture_min": 25,
    "ideal_moisture_max": 45
  }'
```

#### Delete a Plant
```bash
curl -X DELETE http://localhost:8000/plants/1
```

**Response:**
```json
{
  "message": "Plant deleted"
}
```

#### Add a Moisture Reading
```bash
curl -X POST http://localhost:8000/readings \
  -H "Content-Type: application/json" \
  -d '{
    "plant_id": 1,
    "moisture_percent": 35.5
  }'
```

**Response:**
```json
{
  "id": 1,
  "plant_id": 1,
  "moisture_percent": 35.5,
  "timestamp": "2024-01-15T10:30:00"
}
```

#### Get Readings for a Plant
```bash
curl http://localhost:8000/readings/1
```

#### Delete a Reading
```bash
curl -X DELETE http://localhost:8000/readings/1
```

**Response:**
```json
{
  "message": "Reading deleted"
}
```

#### Get Dashboard Data
```bash
curl http://localhost:8000/dashboard
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Aloe Vera",
    "species": "Aloe barbadensis",
    "ideal_moisture_min": 20,
    "ideal_moisture_max": 40,
    "status": "ok",
    "latest_reading": {
      "id": 1,
      "moisture_percent": 35.5,
      "timestamp": "2024-01-15T10:30:00"
    }
  }
]
```

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"

# Create a plant
plant_data = {
    "name": "Snake Plant",
    "species": "Sansevieria trifasciata",
    "ideal_moisture_min": 30,
    "ideal_moisture_max": 50
}
response = requests.post(f"{BASE_URL}/plants", json=plant_data)
plant = response.json()
print(f"Created plant: {plant['name']} (ID: {plant['id']})")

# Add a reading
reading_data = {
    "plant_id": plant["id"],
    "moisture_percent": 42.0
}
response = requests.post(f"{BASE_URL}/readings", json=reading_data)
reading = response.json()
print(f"Added reading: {reading['moisture_percent']}%")

# Get dashboard data
response = requests.get(f"{BASE_URL}/dashboard")
dashboard = response.json()
for item in dashboard:
    print(f"{item['name']}: {item['status']}")
```

### Using JavaScript Fetch

```javascript
const API_BASE = 'http://localhost:8000';

// Create a plant
async function createPlant(plantData) {
  const response = await fetch(`${API_BASE}/plants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plantData)
  });
  return await response.json();
}

// Add a reading
async function addReading(plantId, moisture) {
  const response = await fetch(`${API_BASE}/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plant_id: plantId, moisture_percent: moisture })
  });
  return await response.json();
}

// Get dashboard data
async function getDashboard() {
  const response = await fetch(`${API_BASE}/dashboard`);
  return await response.json();
}
```

---

## 🧪 Running Tests

The project includes comprehensive pytest test suites for both API endpoints and status logic.

### Run All Tests
```bash
# From project root
pytest

# Or with verbose output
pytest -v

# Or with quiet output
pytest -q
```

### Run Specific Test Files
```bash
# Test plant endpoints
pytest backend/tests/test_plants_endpoint.py

# Test status logic
pytest backend/tests/test_status_logic.py
```

### Expected Output
```
========================= test session starts =========================
collected 5 items

backend/tests/test_plants_endpoint.py ...                        [ 60%]
backend/tests/test_status_logic.py ..                            [100%]

========================= 5 passed in 2.34s =========================
```

---

## 💻 Usage

### Accessing the Application

1. **Start the services** (Docker or local)
2. **Open the dashboard**: http://localhost:3000 (Docker) or your local server URL
3. **Navigate through the interface**:
   - View all plants on the dashboard
   - Click "Add Plant" to create a new plant
   - Click on a plant to view details and reading history
   - Click "Edit" to modify plant information
   - Click "Add Reading" to record a moisture measurement
   - Use search and filters to find specific plants

### Understanding Plant Status

- **🟢 OK**: Plant moisture is within ideal range
- **🟡 Needs Water**: Moisture is below the minimum threshold
- **🔴 Overwatered**: Moisture exceeds the maximum threshold
- **⚪ No Data**: No readings have been recorded yet

---

## 🔍 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify MySQL is running: `mysql -u root -p`
- Check `.env` file has correct credentials
- Ensure database exists or can be created
- For Docker: Check database container is healthy: `docker compose ps`

**Port 8000 Already in Use:**
- Stop the process using port 8000
- Or change the port in `uvicorn` command: `uvicorn backend.main:app --reload --port 8001`

**Import Errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r backend/requirements.txt`

### Frontend Issues

**CORS Errors:**
- Ensure backend is running
- Check backend CORS settings in `backend/main.py`
- Verify frontend is served through a web server (not `file://`)

**API Requests Failing:**
- Check backend is running and accessible
- Verify API base URL in frontend code matches backend URL
- Check browser console for error messages

**Frontend Not Loading:**
- Ensure frontend is served through a web server
- Check browser console for errors
- Verify all file paths are correct

### Docker Issues

See the [Docker Troubleshooting](#troubleshooting-docker) section above or refer to [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed troubleshooting steps.

---

## 📝 License

This project is developed for **PIPP Engineering**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

## 📧 Contact

For questions or support, please open an issue on the GitHub repository.

---
