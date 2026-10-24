"""FastAPI application entry point."""
from fastapi import FastAPI

from app.database import Base, engine
from app.models import user, vehicle  # noqa: F401  (registers the tables)
from app.routers import auth, vehicles

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory API")
app.include_router(auth.router)
app.include_router(vehicles.router)