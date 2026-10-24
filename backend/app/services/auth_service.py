"""Business logic for authentication."""
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.security import hash_password


class EmailAlreadyRegistered(Exception):
    """Raised when someone registers with an email that already exists."""


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register(self, email: str, password: str) -> User:
        if self.user_repo.get_by_email(email):
            raise EmailAlreadyRegistered()
        return self.user_repo.create(email, hash_password(password))