"""Application settings."""
import os

# In production, set SECRET_KEY as an environment variable. The fallback
# is only for local development and tests.
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60