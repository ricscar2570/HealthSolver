from fastapi import APIRouter
from backend.models.data_training import train_model

router = APIRouter()

@router.post("/train")
async def trigger_training():
    train_model()
    return {"message": "Model retrained successfully"}
