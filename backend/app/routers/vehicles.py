"""HTTP endpoints for vehicles. Every route requires a logged-in user."""
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas import RestockRequest, VehicleCreate, VehicleOut
from app.services.vehicle_service import (OutOfStock, VehicleNotFound,
                                          VehicleService)

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"],
                   dependencies=[Depends(get_current_user)])


def get_vehicle_service(db: Session = Depends(get_db)) -> VehicleService:
    return VehicleService(VehicleRepository(db))


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                         detail="Vehicle not found")


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate,
                   service: VehicleService = Depends(get_vehicle_service)):
    return service.create(payload)


@router.get("", response_model=list[VehicleOut])
def list_vehicles(service: VehicleService = Depends(get_vehicle_service)):
    return service.list_all()


# NOTE: /search must be declared BEFORE /{vehicle_id} routes, otherwise
# FastAPI would try to read the word "search" as a vehicle id.
@router.get("/search", response_model=list[VehicleOut])
def search_vehicles(make: str | None = None, model: str | None = None,
                    category: str | None = None,
                    min_price: float | None = None, max_price: float | None = None,
                    service: VehicleService = Depends(get_vehicle_service)):
    return service.search(make=make, model=model, category=category,
                          min_price=min_price, max_price=max_price)


@router.put("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: int, payload: VehicleCreate,
                   service: VehicleService = Depends(get_vehicle_service)):
    try:
        return service.update(vehicle_id, payload)
    except VehicleNotFound:
        raise _not_found()


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
def delete_vehicle(vehicle_id: int,
                   service: VehicleService = Depends(get_vehicle_service)):
    try:
        service.delete(vehicle_id)
    except VehicleNotFound:
        raise _not_found()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{vehicle_id}/purchase", response_model=VehicleOut)
def purchase_vehicle(vehicle_id: int,
                     service: VehicleService = Depends(get_vehicle_service)):
    try:
        return service.purchase(vehicle_id)
    except VehicleNotFound:
        raise _not_found()
    except OutOfStock:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Vehicle is out of stock")


@router.post("/{vehicle_id}/restock", response_model=VehicleOut,
             dependencies=[Depends(require_admin)])
def restock_vehicle(vehicle_id: int, payload: RestockRequest,
                    service: VehicleService = Depends(get_vehicle_service)):
    try:
        return service.restock(vehicle_id, payload.quantity)
    except VehicleNotFound:
        raise _not_found()