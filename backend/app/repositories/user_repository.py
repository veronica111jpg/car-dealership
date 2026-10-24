"""Database access for users."""
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def create(self, email: str, hashed_password: str, role: str = "user") -> User:
        user = User(email=email, hashed_password=hashed_password, role=role)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)  # reload so we get the generated id
        return user