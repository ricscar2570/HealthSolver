import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import make_asgi_app
from backend.routes.predict import router as predict_router
from backend.utils.logging_config import setup_logging

# Configura il logging
setup_logging()

app = FastAPI(title="HealthSolver API")

# Middleware globale per la gestione degli errori
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException as e:
        logging.error(f"HTTP Error: {e.detail}")
        return JSONResponse(status_code=e.status_code, content={"error": e.detail})
    except Exception as e:
        logging.exception("Errore interno del server")
        return JSONResponse(status_code=500, content={"error": "Internal Server Error", "details": str(e)})

# Inizializza Prometheus per raccogliere metriche API
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

# Espone metriche personalizzate per il modello ML
app.mount("/custom_metrics", make_asgi_app())

# Registra le rotte
app.include_router(predict_router)

@app.get("/")
def root():
    return {"message": "HealthSolver API is running"}
