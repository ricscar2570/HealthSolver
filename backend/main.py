# backend/main.py
import logging
import os # Importa os per le variabili d'ambiente

from fastapi import FastAPI, HTTPException, Request, Depends # Aggiungi Depends
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import make_asgi_app

# Importa i router che vuoi attivare
from backend.routes.predict import router as predict_router
from backend.routes.analytics import router as analytics_router # Per dashboard/data e predict
from backend.routes.cnn_api import router as cnn_router # Per analisi DICOM
from backend.routes.train_trigger import router as train_trigger_router # Per triggerare training
from backend.routes.alerts import router as alerts_router # Per vedere gli alert loggati
# from backend.routes.pacs import router as pacs_router # Da includere se PACS è configurato
# from backend.routes.ehr import router as ehr_router # Da includere se FHIR è configurato

# === Autenticazione (Richiede Implementazione Helper) ===
# Se vuoi attivare auth/mfa, DEVI implementare le funzioni mancanti in un file
# come backend/auth_utils.py e importare/usare i router qui.
# Altrimenti, lasciali commentati.
# from backend.routes.auth import router as auth_router
# from backend.routes.mfa import router as mfa_router
# import backend.auth_utils # Assicurati che esista e contenga le funzioni

# Configura il logging UNIFICATO
from backend.utils.logging_config import setup_logging
setup_logging() # Chiama la funzione di setup

# Carica configurazioni da variabili d'ambiente (esempio)
# API_TITLE = os.getenv("API_TITLE", "HealthSolver API")

app = FastAPI(title="HealthSolver API") # Usa API_TITLE se definito

# Middleware globale per la gestione degli errori
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException as e:
        logging.error(f"HTTP Error ({request.method} {request.url}): {e.status_code} - {e.detail}")
        return JSONResponse(status_code=e.status_code, content={"error": e.detail})
    except Exception as e:
        logging.exception(f"Internal Server Error ({request.method} {request.url})")
        return JSONResponse(status_code=500, content={"error": "Internal Server Error", "details": str(e)})

# Inizializza Prometheus per raccogliere metriche API standard
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

# Espone metriche personalizzate definite in backend/models.py
# (assicurati che make_asgi_app sia importato da prometheus_client)
# app.mount("/custom_metrics", make_asgi_app()) # Attenzione: make_asgi_app non aggrega metriche da più processi!
# Per produzione con più worker (uvicorn -w N), usare una soluzione diversa per le custom metrics
# come prometheus-client con multiprocess_mode='livesum'.
# Per semplicità in sviluppo, puoi lasciarlo, ma sappi del limite.

# --- Registra le Rotte ---
app.include_router(predict_router, prefix="/predict", tags=["Prediction"]) # Cambiato prefix a /predict
app.include_router(analytics_router, prefix="/dashboard", tags=["Dashboard Support"]) # Per /dashboard/data e /dashboard/predict
app.include_router(cnn_router, prefix="/cnn", tags=["CNN Analysis"]) # Per /cnn/analyze
app.include_router(train_trigger_router, prefix="/admin", tags=["Admin"]) # Per /admin/train
app.include_router(alerts_router, prefix="/admin", tags=["Admin"]) # Per /admin/alerts

# --- Router Opzionali (decommenta e implementa dipendenze se necessario) ---
# app.include_router(auth_router, prefix="/auth", tags=["Authentication"]) # RICHIEDE IMPLEMENTAZIONE HELPERS
# app.include_router(mfa_router, prefix="/mfa", tags=["Authentication"]) # RICHIEDE IMPLEMENTAZIONE HELPERS e AUTH
# app.include_router(pacs_router, prefix="/pacs", tags=["PACS"]) # RICHIEDE SERVER PACS FUNZIONANTE
# app.include_router(ehr_router, prefix="/ehr", tags=["EHR"]) # RICHIEDE SERVER FHIR FUNZIONANTE

@app.get("/", tags=["General"])
def root():
    """ Root endpoint providing basic API information. """
    logging.info("Root endpoint accessed.")
    return {"message": "Welcome to HealthSolver API", "status": "running"}

# --- Esempio di gestione dipendenze per Auth (se implementato) ---
# async def get_api_key(api_key_header: str = Depends(oauth2_scheme)):
#     if not await backend.auth_utils.validate_api_key(api_key_header):
#         raise HTTPException(status_code=403, detail="Invalid API Key")
#     return api_key_header

# Puoi aggiungere `Depends(get_api_key)` ai router che richiedono protezione
# Esempio: app.include_router(admin_router, prefix="/admin", tags=["Admin"], dependencies=[Depends(get_api_key)])
