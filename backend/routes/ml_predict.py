"""Deprecated standalone ML prediction route.

Kept import-safe for local historical development. The active browser edition
uses the versioned models under /predictive instead.
"""
import os
from pathlib import Path

import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException

router = APIRouter()
MODEL_PATH = Path(
    os.getenv(
        "HEALTHSOLVER_LEGACY_THERAPY_MODEL_PATH",
        "models/saved_models/therapy_model.pkl",
    )
)
_model = None


def _get_model():
    global _model
    if _model is not None:
        return _model

    if not MODEL_PATH.is_file():
        raise HTTPException(
            status_code=503,
            detail="Legacy therapy model is not available.",
        )

    try:
        _model = joblib.load(MODEL_PATH)
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Legacy therapy model could not be loaded.",
        ) from exc
    return _model


@router.post("/predict")
def predict(features: dict):
    """Run the deprecated local therapy classifier in FastAPI's worker thread."""
    model = _get_model()
    try:
        X = pd.DataFrame([features])
        prediction = model.predict(X)[0]
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail="Legacy model inputs are invalid or incompatible.",
        ) from exc
    return {"prediction": int(prediction), "legacy": True}
