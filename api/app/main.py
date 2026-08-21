from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import api_router

app = FastAPI(
    title="CarbonAlpha India API",
    description="Deterministic Decision-Intelligence & Capital-Allocation Layer for the Indian Carbon Market (CCTS).",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "CarbonAlpha India API",
        "model_version": settings.CARBONALPHA_MODEL_VERSION,
        "regulatory_version": settings.REGULATORY_DATA_VERSION,
        "gemini_active": bool(settings.GEMINI_API_KEY)
    }

app.include_router(api_router)
