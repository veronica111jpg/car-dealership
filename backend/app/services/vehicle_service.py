"""Business logic for vehicles and inventory."""
from app.models.vehicle import Vehicle
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas import VehicleCreate


class VehicleNotFound(Exception):
    """Raised when a vehicle id doesn't exist."""


class OutOfStock(Exception):
    """Raised when purchasing a vehicle with zero quantity."""


class VehicleService:
    def __init__(self, repo: VehicleRepository):
        self.repo = repo

    def create(self, data: VehicleCreate) -> Vehicle:
        return self.repo.create(**data.model_dump())

    def list_all(self) -> list[Vehicle]:
        return self.repo.list_all()

    def search(self, **filters) -> list[Vehicle]:
        return self.repo.search(**filters)

    def _get_or_raise(self, vehicle_id: int) -> Vehicle:
        vehicle = self.repo.get_by_id(vehicle_id)
        if vehicle is None:
            raise VehicleNotFound()
        return vehicle

    def update(self, vehicle_id: int, data: VehicleCreate) -> Vehicle:
        vehicle = self._get_or_raise(vehicle_id)
        for field, value in data.model_dump().items():
            setattr(vehicle, field, value)
        return self.repo.save(vehicle)

    def delete(self, vehicle_id: int) -> None:
        self.repo.delete(self._get_or_raise(vehicle_id))

    def purchase(self, vehicle_id: int) -> Vehicle:
        """Sell one unit. Refuses if none are left."""
        vehicle = self._get_or_raise(vehicle_id)
        if vehicle.quantity < 1:
            raise OutOfStock()
        vehicle.quantity -= 1
        return self.repo.save(vehicle)

    def restock(self, vehicle_id: int, amount: int) -> Vehicle:
        vehicle = self._get_or_raise(vehicle_id)
        vehicle.quantity += amount
        return self.repo.save(vehicle)