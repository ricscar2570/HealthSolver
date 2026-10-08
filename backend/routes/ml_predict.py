"""Deprecated standalone ML prediction route.

Kept import-safe for local historical development. The active browser edition
uses the versioned models under /predictive instead.
"""
from pathlib import Path

import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException

router = APIRouter()
MODEL_PATH = Path("models/saved_models/therapy_model.pkl")
_model = None


def _get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise HTTPException(status_code=503, detail="Legacy therapy model is not available.")
        _model = joblib.load(MODEL_PATH)
    return _model


@router.post("/predict")
async def predict(features: dict):
    model = _get_model()
    X = pd.DataFrame([features])
    prediction = model.predict(X)[0]
    return {"prediction": int(prediction), "legacy": True}
