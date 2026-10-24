"""Database access for vehicles."""
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **fields) -> Vehicle:
        vehicle = Vehicle(**fields)
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def list_all(self) -> list[Vehicle]:
        return self.db.query(Vehicle).order_by(Vehicle.id).all()