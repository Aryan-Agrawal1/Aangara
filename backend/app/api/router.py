from fastapi import APIRouter
from app.api.endpoints_sectors import router as sectors_router
from app.api.endpoints_entities import router as entities_router
from app.api.endpoints_calculation import router as calc_router
from app.api.endpoints_scenarios import router as scenarios_router
from app.api.endpoints_sources import router as sources_router
from app.api.endpoints_intelligence import router as intelligence_router

api_router = APIRouter(prefix="/api")
api_router.include_router(sectors_router)
api_router.include_router(entities_router)
api_router.include_router(calc_router)
api_router.include_router(scenarios_router)
api_router.include_router(sources_router)
api_router.include_router(intelligence_router)
