from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine, get_db
from backend.models import Base
from backend import crud
from backend.schemas import PlantCreate, PlantUpdate, ReadingCreate, PlantOut, ReadingOut



app = FastAPI()

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE all crud
    allow_headers=["*"],    # allow all request headers
)



# Plant Endpoints


# Create a new plant
@app.post("/plants", response_model=PlantOut)
def create_plant(data: PlantCreate, db: Session = Depends(get_db)):
    return crud.create_plant(db, data)
# Accepts: PlantCreate ---> no ID, incoming data
# Returns: PlantOut, outgoing data with ID

# Get all plants
@app.get("/plants", response_model=list[PlantOut])
def get_all_plants(db: Session = Depends(get_db)):
    return crud.get_plants(db)


# Get a single plant by ID
@app.get("/plants/{plant_id}", response_model=PlantOut)
def get_plant(plant_id: int, db: Session = Depends(get_db)):
    plant = crud.get_plant_by_id(db, plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant


# Update plant data
@app.put("/plants/{plant_id}", response_model=PlantOut)
def update_plant(plant_id: int, data: PlantUpdate, db: Session = Depends(get_db)):
    updated = crud.update_plant(db, plant_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Plant not found")
    return updated


# Delete plant
@app.delete("/plants/{plant_id}")
def delete_plant(plant_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_plant(db, plant_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Plant not found")
    return {"message": "Plant deleted"}




# Reading Endpoints

# Create a new moisture reading
@app.post("/readings", response_model=ReadingOut)
def create_reading(data: ReadingCreate, db: Session = Depends(get_db)):
    return crud.create_reading(db, data)


@app.get("/readings/{plant_id}", response_model=list[ReadingOut])
def get_readings(plant_id: int, db: Session = Depends(get_db)):
    plant = crud.get_plant_by_id(db, plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant.readings


# -----------------------------
# Dashboard Endpoint
# -----------------------------

@app.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_data(db)
