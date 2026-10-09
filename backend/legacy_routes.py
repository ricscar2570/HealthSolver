"""Legacy compatibility router.

This module belongs to the pre-browser HealthSolver prototype and is not used by
the current GitHub Pages Research Edition. It remains importable for controlled
local demonstrations only.
"""

import random

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.models import predict_therapy

router = APIRouter()


class LegacyPatientFeatures(BaseModel):
    age: int
    bmi: float
    condition_severity: int
    comorbidities_count: int


@router.post("/recommendation/")
def recommendation(data: LegacyPatientFeatures):
    """Return the legacy therapy-model class when a local model is available."""
    try:
        prediction = predict_therapy(
            [data.age, data.bmi, data.condition_severity, data.comorbidities_count]
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail="Legacy therapy model is unavailable.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Legacy therapy prediction failed.",
        ) from exc
    return {"recommended_therapy": int(prediction), "legacy": True}


@router.get("/chart_data/")
def chart_data():
    """Return explicitly synthetic chart data for the legacy demonstration."""
    return {
        "labels": ["Therapy A", "Therapy B", "Therapy C"],
        "datasets": [
            {
                "label": "Synthetic demo risk scores",
                "data": [round(random.uniform(0.1, 0.9), 2) for _ in range(3)],
                "backgroundColor": [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                ],
                "borderColor": [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                ],
                "borderWidth": 1,
            }
        ],
        "research_only": True,
        "synthetic": True,
        "note": "Synthetic legacy demonstration data; not a clinical risk estimate.",
    }
