import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/alerts")
def get_alerts():
    """Restituisce gli alert registrati nel file logs/alerts.log"""
    try:
        with open("logs/alerts.log", "r") as file:
            logs = file.readlines()
        return JSONResponse(content={"alerts": logs})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
