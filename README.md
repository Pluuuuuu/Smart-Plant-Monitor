# 🌱 Smart Plant Monitor

A full-stack plant monitoring system that tracks soil moisture, analyzes plant health, and provides a clean, functional dashboard for managing plants and their readings.

This project includes:

* A **FastAPI backend** with MySQL database
* A **modern frontend** built with HTML/CSS/JS
* A **status engine** that determines plant health
* Full **CRUD** for plants
* **Moisture readings** with validation and history
* Fully automated **pytest** test suite
* **Dashboard analytics + filtering**
* Clean UI inspired by the provided design mockups

---

# 📦 Features

### 🌿 Plant Management

* Add plants
* Edit plant info
* View detailed plant page
* View plant status (OK, Needs Water, Overwatered, No Data)

### 💧 Moisture Readings

* Add new readings
* Automatic status calculation
* Viewing moisture history per plant
* Last reading preview on dashboard

### 📊 Dashboard

* Global statistics
* Status filtering
* Search by name/species
* Quick actions

  * View details
  * Edit plant
  * Add reading

### 🧠 Status Logic

The system uses a simple rule-based engine:

```
needs_water   → moisture < ideal_min
overwatered   → moisture > ideal_max
ok            → ideal_min ≤ moisture ≤ ideal_max
no_data       → no readings exist
```

---

# 🏗️ Tech Stack

### **Backend**

* Python 3
* FastAPI
* SQLAlchemy
* pydantic
* PyMySQL
* dotenv

### **Database**

* MySQL
* Auto-creation on startup if DB doesn’t exist

### **Frontend**

* Pure HTML
* CSS
* JavaScript
* Completely API-driven
* Uses clean modern UI styling

### **Testing**

* pytest
* FastAPI TestClient
* 5 test suites included (status logic + endpoints)

---

# 📁 Project Structure

```
Smart-Plant-Monitor/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── database.py
│   ├── status_logic.py
│   └── tests/
│       ├── test_plants_endpoint.py
│       └── test_status_logic.py
│
├── frontend/
│   ├── shared/
│   │   ├── utils.js
│   │   ├── variables.css
│   │   ├── header.html
│   │   └── footer.html
│   ├── dashboard/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── plant_form/
│   │   ├── add_plant.html
│   │   ├── edit_plant.html
│   │   ├── plant_details.html
│   │   ├── script.js
│   │   └── style.css
│   └── readings/
│       ├── add_reading.html
│       ├── script.js
│       └── style.css
│
└── README.md
```

---

# 🛠️ Setup Instructions

## 1️⃣ Clone the project

```bash
git clone https://github.com/Pluuuuuu/Smart-Plant-Monitor.git
cd Smart-Plant-Monitor
```

## 2️⃣ Create and activate a virtual environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

## 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

## 4️⃣ Configure the `.env` file

Create a `.env` in `/backend`:

```
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=smart_plant_db
```

## 5️⃣ Run the backend

From project root:

```bash
uvicorn backend.main:app --reload
```

Backend starts on:

```
http://127.0.0.1:8000
```

Interactive docs:

```
http://127.0.0.1:8000/docs
```

## 6️⃣ Run the frontend

The frontend **must** be served through a local web server.
Opening the HTML files directly in Chrome using `file://` will prevent shared components
(header, footer, scripts) from loading due to browser security restrictions.

Use one of the following methods:

#### **Option A — VS Code (Recommended)**

1. Open the `frontend` folder in VS Code
2. Right-click `dashboard/index.html`
3. Select **“Open with Live Server”**

#### **Option B — Python HTTP Server**

```bash
cd frontend
python -m http.server 5500
```

Then visit:

```
http://localhost:5500/dashboard/index.html
```

---

# 🧪 Running Tests

To run all tests:

```bash
pytest -q
```

All tests should pass:

```
5 passed, 0 failed
```

---

# 🎨 UI Preview

The included UI matches the provided mockups:

* Clean dashboard
* Plant details card
* Add/edit plant forms
* Add reading form
* Responsive layout

---

# 🚀 Future Enhancements (Optional)

* Delete plant
* Real sensor integration (ESP32 / Raspberry Pi)
* WebSocket real-time updates
* Charts for moisture history
* Authentication system

---

# 🤝 Contributing

Pull requests are welcome.
Fork the repo → make changes → open PR.

---

# 📜 License

This project is for academic exercise purposes.
