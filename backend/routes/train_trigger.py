from fastapi import APIRouter, HTTPException

from backend.models.data_training import train_model

router = APIRouter()


@router.post("/train")
def trigger_training():
    """Run the deprecated local training job without blocking the ASGI event loop."""
    try:
        train_model()
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail="Legacy training cannot run with the available local data.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Legacy training failed.",
        ) from exc
    return {"message": "Legacy model retrained successfully."}
