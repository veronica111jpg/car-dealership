"""HTTP endpoints for vehicles. Every route requires a logged-in user."""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas import VehicleCreate, VehicleOut
from app.services.vehicle_service import VehicleService

# dependencies=[...] applies the login check to every route in this router.
router = APIRouter(prefix="/api/vehicles", tags=["vehicles"],
                   dependencies=[Depends(get_current_user)])


def get_vehicle_service(db: Session = Depends(get_db)) -> VehicleService:
    return VehicleService(VehicleRepository(db))


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate,
                   service: VehicleService = Depends(get_vehicle_service)):
    return service.create(payload)


@router.get("", response_model=list[VehicleOut])
def list_vehicles(service: VehicleService = Depends(get_vehicle_service)):
    return service.list_all()