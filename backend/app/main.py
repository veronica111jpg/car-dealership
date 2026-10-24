"""FastAPI application entry point."""
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.database import Base, engine
from app.models import user, vehicle  # noqa: F401  (registers the tables)
from app.routers import auth, vehicles

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory API")
# Allow the React dev server to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(vehicles.router)