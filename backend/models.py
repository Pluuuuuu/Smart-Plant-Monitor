from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime # import column types and FK
from sqlalchemy.orm import relationship # import relationship helper
from datetime import datetime # import timestamp generator
# import Base class used to define models
from backend.database import Base



# Plant Model (plants table)

class Plant(Base):                             
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    species = Column(String(100), nullable=False)
    ideal_moisture_min = Column(Integer, nullable=False)
    ideal_moisture_max = Column(Integer, nullable=False)

    # One plant → many readings
    readings = relationship("Reading", back_populates="plant")



# Reading Model (readings table)

class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    moisture_percent = Column(Float, nullable=False)

    # Many readings → one plant
    plant = relationship("Plant", back_populates="readings")



#Base.metadata.create_all(engine)  --> autom create them
#Plant 1 → N Readings
#relationship() and list  returning many items → "one-to-many