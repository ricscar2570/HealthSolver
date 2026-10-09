from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()
ALERT_LOG = Path("logs/alerts.log")


@router.get("/alerts")
def get_alerts():
    """Return legacy alerts; an absent log is a valid empty state."""
    if not ALERT_LOG.exists():
        return {"alerts": []}
    try:
        return {"alerts": ALERT_LOG.read_text(encoding="utf-8", errors="replace").splitlines(True)}
    except OSError:
        return JSONResponse(
            status_code=500,
            content={"error": "Unable to read legacy alert log."},
        )
