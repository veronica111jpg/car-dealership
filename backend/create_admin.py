"""Create (or promote) an admin account.

Usage: python create_admin.py you@example.com yourpassword
"""
import sys

from app.database import Base, SessionLocal, engine
from app.models import user, vehicle  # noqa: F401  (registers the tables)
from app.repositories.user_repository import UserRepository
from app.security import hash_password


def main(email: str, password: str) -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    repo = UserRepository(db)
    existing = repo.get_by_email(email)
    if existing:
        existing.role = "admin"
        db.commit()
    else:
        repo.create(email, hash_password(password), role="admin")
    db.close()
    print(f"Admin ready: {email}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])