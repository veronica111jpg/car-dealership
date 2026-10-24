"""Business logic for authentication."""

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.security import create_access_token, hash_password, verify_password


class EmailAlreadyRegistered(Exception):
    """Raised when someone registers with an email that already exists."""
    pass


class InvalidCredentials(Exception):
    """Raised when email or password is wrong."""
    pass


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def login(self, email: str, password: str) -> str:
        user = self.user_repo.get_by_email(email)
        # Same error for unknown email and wrong password, so attackers
        # can't tell which emails are registered.
        if user is None or not verify_password(password, user.hashed_password):
            raise InvalidCredentials()
        return create_access_token(user.id, user.role)

    def register(self, email: str, password: str) -> User:
        if self.user_repo.get_by_email(email):
            raise EmailAlreadyRegistered()
        return self.user_repo.create(email, hash_password(password))