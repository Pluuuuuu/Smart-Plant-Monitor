from datetime import datetime
from pydantic import BaseModel, validator # import Pydantic base model for request/response validation


class PlantBase(BaseModel):
    name: str
    species: str
    ideal_moisture_min: int
    ideal_moisture_max: int

    # Validate moisture ranges
    @validator("ideal_moisture_min")
    def min_range(cls, v):
        if v < 0 or v > 100:
            raise ValueError("ideal_moisture_min must be between 0 and 100")
        return v

    @validator("ideal_moisture_max")
    def max_range(cls, v, values):
        min_val = values.get("ideal_moisture_min")
        if v < 0 or v > 100:
            raise ValueError("ideal_moisture_max must be between 0 and 100")
        if min_val is not None and v < min_val:
            raise ValueError("ideal_moisture_max must be >= ideal_moisture_min")
        return v

class PlantCreate(PlantBase):
    pass


class PlantUpdate(PlantBase):
    pass


class PlantOut(PlantBase):
    id: int

    class Config:
        orm_mode = True # Convert a real DB object into a response model.


class ReadingBase(BaseModel):
    plant_id: int
    moisture_percent: float


class ReadingCreate(ReadingBase):
    pass


class ReadingOut(BaseModel):
    id: int
    plant_id: int
    moisture_percent: float
    timestamp: datetime

    class Config:
        orm_mode = True
