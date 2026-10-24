"""Password hashing helpers."""
from passlib.context import CryptContext

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Turn a password into a one-way hash safe to store."""
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a login attempt against the stored hash."""
    return _pwd_context.verify(plain_password, hashed_password)