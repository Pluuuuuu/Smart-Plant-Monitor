from sqlalchemy.orm import Session
from backend.models import Plant, Reading
from backend.schemas import PlantCreate, PlantUpdate, ReadingCreate
from backend.status_logic import compute_status



# Create a new plant
def create_plant(db: Session, data: PlantCreate):
    plant = Plant(
        name=data.name,
        species=data.species,
        ideal_moisture_min=data.ideal_moisture_min,
        ideal_moisture_max=data.ideal_moisture_max,
    )
    db.add(plant)
    db.commit()
    db.refresh(plant)
    return plant


# Get all plants ordered by id
def get_plants(db: Session):
    return db.query(Plant).order_by(Plant.id).all()


# Get one plant
def get_plant_by_id(db: Session, plant_id: int):
    return db.query(Plant).filter(Plant.id == plant_id).first()


# Update plant
def update_plant(db: Session, plant_id: int, data: PlantUpdate):
    plant = get_plant_by_id(db, plant_id)
    if not plant:
        return None
    
    plant.name = data.name
    plant.species = data.species
    plant.ideal_moisture_min = data.ideal_moisture_min
    plant.ideal_moisture_max = data.ideal_moisture_max
    
    db.commit()
    db.refresh(plant)
    return plant


# Delete plant
def delete_plant(db: Session, plant_id: int):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        return False

    # 1) Delete all readings for this plant
    db.query(Reading).filter(Reading.plant_id == plant_id).delete(
        synchronize_session=False
    )

    # 2) Delete the plant itself
    db.delete(plant)
    db.commit()
    return True




# Add a moisture reading
def create_reading(db: Session, data: ReadingCreate):
    reading = Reading(
        plant_id=data.plant_id,
        moisture_percent=data.moisture_percent
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


# Get latest reading for a plant
def get_latest_reading(db: Session, plant_id: int):
    return (
        db.query(Reading)
        .filter(Reading.plant_id == plant_id)
        .order_by(Reading.timestamp.desc())
        .first()
    )


# Dashboard helper: return plants with status + latest reading
def get_dashboard_data(db: Session):
    plants = get_plants(db)
    dashboard_items = []

    for plant in plants:
        latest = get_latest_reading(db, plant.id)
        latest_value = latest.moisture_percent if latest else None

        status = compute_status(
            plant.ideal_moisture_min,
            plant.ideal_moisture_max,
            latest_value
        )

        dashboard_items.append({
            "id": plant.id,
            "name": plant.name,
            "species": plant.species,
            "ideal_moisture_min": plant.ideal_moisture_min,
            "ideal_moisture_max": plant.ideal_moisture_max,
            "latest_reading": latest_value,
            "last_reading": {
                "moisture_percent": latest.moisture_percent,
                "timestamp": (latest.timestamp.isoformat() + "Z") if (latest and latest.timestamp) else None
            } if latest else None,
            "status": status,
        })

    return dashboard_items

# DELETE a specific reading
def delete_reading(db: Session, reading_id: int):
    reading = db.query(Reading).filter(Reading.id == reading_id).first()
    if not reading:
        return False

    db.delete(reading)
    db.commit()
    return True

