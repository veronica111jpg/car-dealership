"""FastAPI application entry point."""
from fastapi import FastAPI

from app.database import Base, engine
from app.models import user  # noqa: F401  (imported so the table gets registered)
from app.routers import auth

# Create tables on startup if they don't exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory API")
app.include_router(auth.router)