import pandas as pd
from fastapi import APIRouter, HTTPException

router = APIRouter()
DATA_PATH = "datasets/patient_data.csv"


@router.get("/data")
async def get_patient_data():
    """Restituisce i dati dei pazienti per la dashboard legacy."""
    try:
        df = pd.read_csv(DATA_PATH)
        return df.to_dict(orient="records")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Errore nel caricamento dati: {exc}") from exc


@router.get("/predict")
async def predict_condition():
    """Previsione temporale legacy opzionale basata su Prophet."""
    try:
        from prophet import Prophet
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail="Legacy forecasting dependency 'prophet' is not installed.",
        ) from exc

    try:
        df = pd.read_csv(DATA_PATH)
        if "condition_severity" not in df.columns:
            raise ValueError("condition_severity column is missing")
        if len(df) < 2:
            raise ValueError("at least two observations are required for forecasting")

        df["date"] = pd.date_range(start="2024-01-01", periods=len(df), freq="D")
        df.rename(columns={"condition_severity": "y", "date": "ds"}, inplace=True)

        model = Prophet()
        model.fit(df[["ds", "y"]])

        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)
        return forecast[["ds", "yhat"]].to_dict(orient="records")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Errore nella previsione: {exc}") from exc
