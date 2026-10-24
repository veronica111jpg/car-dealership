"""Pydantic schemas: the shape of request and response data."""
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """What the client sends to register."""
    email: EmailStr
    password: str = Field(min_length=6)


class UserOut(BaseModel):
    """What we send back. Note: no password field, so it can't leak."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class VehicleCreate(BaseModel):
    """Fields needed to add a vehicle. Price and quantity can't be negative."""
    make: str = Field(min_length=1)
    model: str = Field(min_length=1)
    category: str = Field(min_length=1)
    price: float = Field(ge=0)
    quantity: int = Field(ge=0)


class VehicleOut(VehicleCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int

class RestockRequest(BaseModel):
    """How many units to add. Must be at least 1."""
    quantity: int = Field(gt=0)
