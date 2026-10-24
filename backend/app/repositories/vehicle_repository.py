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

    def get_by_id(self, vehicle_id: int) -> Vehicle | None:
        return self.db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def save(self, vehicle: Vehicle) -> Vehicle:
        """Persist changes made to an already-loaded vehicle."""
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, vehicle: Vehicle) -> None:
        self.db.delete(vehicle)
        self.db.commit()

    def search(self, make=None, model=None, category=None,
               min_price=None, max_price=None) -> list[Vehicle]:
        """Filter by any combination of fields. Text matches are case-insensitive."""
        query = self.db.query(Vehicle)
        if make:
            query = query.filter(Vehicle.make.ilike(f"%{make}%"))
        if model:
            query = query.filter(Vehicle.model.ilike(f"%{model}%"))
        if category:
            query = query.filter(Vehicle.category.ilike(f"%{category}%"))
        if min_price is not None:
            query = query.filter(Vehicle.price >= min_price)
        if max_price is not None:
            query = query.filter(Vehicle.price <= max_price)
        return query.order_by(Vehicle.id).all()