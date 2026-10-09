import os
from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException

router = APIRouter()
_REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = Path(
    os.getenv(
        "HEALTHSOLVER_PATIENT_DATA_PATH",
        str(_REPO_ROOT / "datasets" / "patient_data.csv"),
    )
)


def _load_patient_data() -> pd.DataFrame:
    try:
        return pd.read_csv(DATA_PATH)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="Legacy analytics dataset is not available.",
        ) from exc
    except (OSError, ValueError, pd.errors.ParserError) as exc:
        raise HTTPException(
            status_code=500,
            detail="Legacy analytics dataset could not be loaded.",
        ) from exc


@router.get("/data")
def get_patient_data():
    """Return the local legacy analytics dataset."""
    return _load_patient_data().to_dict(orient="records")


@router.get("/predict")
def predict_condition():
    """Run the optional legacy Prophet time-series demonstration."""
    try:
        from prophet import Prophet
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail="Legacy forecasting dependency 'prophet' is not installed.",
        ) from exc

    df = _load_patient_data()
    if "condition_severity" not in df.columns:
        raise HTTPException(
            status_code=500,
            detail="Legacy analytics dataset is missing condition_severity.",
        )
    if len(df) < 2:
        raise HTTPException(
            status_code=503,
            detail="Legacy analytics dataset has insufficient observations for forecasting.",
        )

    try:
        working = df[["condition_severity"]].copy()
        working["ds"] = pd.date_range(start="2024-01-01", periods=len(working), freq="D")
        working.rename(columns={"condition_severity": "y"}, inplace=True)

        model = Prophet()
        model.fit(working[["ds", "y"]])

        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)
        return forecast[["ds", "yhat"]].to_dict(orient="records")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Legacy forecasting failed.",
        ) from exc
