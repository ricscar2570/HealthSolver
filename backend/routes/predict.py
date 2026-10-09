from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.models import predict_therapy

router = APIRouter()

class PatientData(BaseModel):
    age: int
    bmi: float
    condition_severity: int
    comorbidities_count: int

@router.post("/predict")
def predict(data: PatientData):
    """API per fare una previsione basata sul modello addestrato."""
    try:
        prediction = predict_therapy([data.age, data.bmi, data.condition_severity, data.comorbidities_count])
        return {"recommended_therapy": int(prediction)}
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Legacy prediction failed.") from exc
