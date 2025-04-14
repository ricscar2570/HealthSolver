from fastapi import APIRouter
import joblib
import pandas as pd

router = APIRouter()

model = joblib.load("models/therapy_model.pkl")

@router.post("/predict")
async def predict(features: dict):
    X = pd.DataFrame([features])
    prediction = model.predict(X)[0]
    return {"prediction": int(prediction)}
