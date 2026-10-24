"""User database model."""
from sqlalchemy import Column, Integer, String

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Either "user" or "admin". Decides access to admin-only endpoints.
    role = Column(String, nullable=False, default="user")