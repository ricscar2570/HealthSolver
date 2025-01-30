import pandas as pd
import plotly.express as px
from prophet import Prophet
from fastapi import APIRouter, HTTPException

router = APIRouter()
DATA_PATH = "datasets/patient_data.csv"

@router.get("/data")
async def get_patient_data():
    """Restituisce i dati dei pazienti per la dashboard"""
    try:
        df = pd.read_csv(DATA_PATH)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nel caricamento dati: {str(e)}")

@router.get("/predict")
async def predict_condition():
    """Previsione dell'evoluzione delle condizioni cliniche"""
    try:
        df = pd.read_csv(DATA_PATH)
        df["date"] = pd.date_range(start="2024-01-01", periods=len(df), freq="D")
        df.rename(columns={"condition_severity": "y", "date": "ds"}, inplace=True)
        
        model = Prophet()
        model.fit(df[["ds", "y"]])
        
        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)
        
        return forecast[["ds", "yhat"]].to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nella previsione: {str(e)}")
