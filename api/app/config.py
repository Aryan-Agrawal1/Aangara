import os
from pydantic import BaseModel

class Settings(BaseModel):
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "127.0.0.1")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./carbonalpha.db")
    
    # Gemini Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Provenance Versions
    CARBONALPHA_MODEL_VERSION: str = "CA-MVP-1.0"
    REGULATORY_DATA_VERSION: str = "REG-2026-08"
    EMISSION_FACTOR_VERSION: str = "EF-2026-01"

settings = Settings()
