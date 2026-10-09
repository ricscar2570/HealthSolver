"""Legacy FastAPI entry point.

The current HealthSolver Research Edition is the browser-only GitHub Pages app.
This module is retained for historical/local development. Optional legacy
features are disabled by default and only registered when explicitly enabled.
"""
import logging
import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator

from backend.routes.predict import router as predict_router
from backend.utils.logging_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HealthSolver Legacy API",
    description="Deprecated local backend; not used by the browser-based Research Edition.",
)


_legacy_cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "HEALTHSOLVER_CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]
if _legacy_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_legacy_cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )


@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException as exc:
        return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})
    except Exception:
        logger.exception("Internal Server Error (%s %s)", request.method, request.url)
        return JSONResponse(status_code=500, content={"error": "Internal Server Error"})


Instrumentator().instrument(app).expose(app, endpoint="/metrics")
app.include_router(predict_router, prefix="/predict", tags=["Legacy Prediction"])


def _enabled(name: str) -> bool:
    return os.getenv(name, "").strip().lower() in {"1", "true", "yes", "on"}


def _load_optional_router(module_name: str, attr: str = "router"):
    try:
        module = __import__(module_name, fromlist=[attr])
        return getattr(module, attr)
    except Exception as exc:
        logger.warning("Optional legacy router %s unavailable: %s", module_name, exc)
        return None


if _enabled("ENABLE_LEGACY_ANALYTICS"):
    router = _load_optional_router("backend.routes.analytics")
    if router is not None:
        app.include_router(router, prefix="/dashboard", tags=["Legacy Dashboard"])

if _enabled("ENABLE_LEGACY_CNN"):
    router = _load_optional_router("backend.routes.cnn_api")
    if router is not None:
        app.include_router(router, prefix="/cnn", tags=["Legacy CNN"])

if _enabled("ENABLE_LEGACY_ADMIN_ROUTES"):
    for module_name in ("backend.routes.train_trigger", "backend.routes.alerts"):
        router = _load_optional_router(module_name)
        if router is not None:
            app.include_router(router, prefix="/admin", tags=["Legacy Admin"])

if _enabled("ENABLE_LEGACY_AUTH"):
    for module_name, prefix in (
        ("backend.routes.auth", "/auth"),
        ("backend.routes.mfa", "/mfa"),
    ):
        router = _load_optional_router(module_name)
        if router is not None:
            app.include_router(router, prefix=prefix, tags=["Legacy Authentication"])

if _enabled("ENABLE_LEGACY_EHR"):
    router = _load_optional_router("backend.routes.ehr")
    if router is not None:
        app.include_router(router, prefix="/ehr", tags=["Legacy EHR"])

if _enabled("ENABLE_LEGACY_PACS"):
    router = _load_optional_router("backend.models.pacs")
    if router is not None:
        app.include_router(router, prefix="/pacs", tags=["Legacy PACS"])


@app.get("/", tags=["General"])
def root():
    return {
        "message": "HealthSolver legacy API",
        "status": "running",
        "browser_research_edition": "https://ricscar2570.github.io/HealthSolver/",
        "legacy": True,
    }
