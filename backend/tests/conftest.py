import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Use in-memory SQLite with StaticPool to support single-process thread sharing safely
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture()
def db_session():
    """Create fresh tables before each test and drop them after."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    """A fake browser whose requests use the test database."""
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


from app.models.user import User
from app.security import create_access_token, hash_password


def _make_user(db_session, email: str, role: str) -> dict:
    """Insert a user directly and return auth headers for them."""
    user = User(email=email, hashed_password=hash_password("secret123"), role=role)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    token = create_access_token(user.id, user.role)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def user_headers(db_session):
    return _make_user(db_session, "user@example.com", "user")


@pytest.fixture()
def admin_headers(db_session):
    return _make_user(db_session, "admin@example.com", "admin")