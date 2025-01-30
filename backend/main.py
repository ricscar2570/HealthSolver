from fastapi import FastAPI
from backend.routes import auth, mfa, pacs, analytics, cnn_api, ehr
from backend.utils.logging import setup_logging
from backend.web_socket import websocket_endpoint

app = FastAPI(title="HealthSolver API")
setup_logging()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(mfa.router, prefix="/mfa", tags=["MFA"])
app.include_router(pacs.router, prefix="/pacs", tags=["PACS"])
app.include_router(analytics.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(cnn_api.router, prefix="/cnn", tags=["CNN AI"])
app.include_router(ehr.router, prefix="/ehr", tags=["EHR"])

app.add_api_websocket_route("/ws", websocket_endpoint)

@app.get("/")
def root():
    return {"message": "HealthSolver API is running"}