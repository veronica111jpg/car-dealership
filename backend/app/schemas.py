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
