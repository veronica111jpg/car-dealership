"""Business logic for vehicles."""
from app.models.vehicle import Vehicle
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas import VehicleCreate


class VehicleService:
    def __init__(self, repo: VehicleRepository):
        self.repo = repo

    def create(self, data: VehicleCreate) -> Vehicle:
        return self.repo.create(**data.model_dump())

    def list_all(self) -> list[Vehicle]:
        return self.repo.list_all()