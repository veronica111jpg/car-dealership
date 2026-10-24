"""HTTP endpoints for authentication."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas import UserCreate, UserOut
from app.services.auth_service import AuthService, EmailAlreadyRegistered

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db))


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, service: AuthService = Depends(get_auth_service)):
    try:
        return service.register(payload.email, payload.password)
    except EmailAlreadyRegistered:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Email already registered")