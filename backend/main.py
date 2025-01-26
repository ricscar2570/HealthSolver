from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.routes import router

app = FastAPI(title="HealthSolver - Medical Decision Support System")

app.add_middleware(GZipMiddleware)

Instrumentator().instrument(app).expose(app)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
