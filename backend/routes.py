from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from app.models import (
    predict_therapy, predict_risk, preprocess_and_add_features,
    reload_models, explain_therapy_prediction
)
from app.database import SessionLocal, Patient
from app.utils import log_audit, anonymize_data, generate_report
import requests

router = APIRouter()

@router.post("/recommendation/")
async def recommendation(patient_data: dict):
    processed_data = preprocess_and_add_features(patient_data)
    return {"recommendation": predict_therapy(processed_data)}

@router.post("/risk_analysis/")
async def risk_analysis(therapy_data: dict):
    processed_data = preprocess_and_add_features(therapy_data)
    return {"risk_score": predict_risk(processed_data)}

@router.post("/his/sync/")
async def sync_his(api_key: str, facility_id: int):
    his_url = f"http://external-his-api.com/facilities/{facility_id}/patients"
    db = SessionLocal()
    try:
        response = requests.get(his_url, headers={"Authorization": f"Bearer {api_key}"})
        response.raise_for_status()
        patients = response.json()

        for patient_data in patients:
            patient = Patient(
                id=patient_data["id"],
                name=patient_data["name"],
                age=patient_data["age"],
                medical_history=patient_data["medical_history"]
            )
            db.merge(patient)
        db.commit()
        return {"status": "Success", "patients_synced": len(patients)}
    except requests.exceptions.RequestException as e:
        db.rollback()
        return {"status": "Error", "details": str(e)}
    finally:
        db.close()
