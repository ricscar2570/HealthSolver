from fhirpy import SyncFHIRClient
from fastapi import APIRouter

router = APIRouter()
client = SyncFHIRClient("https://server.fire.ly")

@router.get("/patient/{patient_id}")
async def get_patient_data(patient_id: str):
    """Recupera i dati di un paziente dal sistema EHR"""
    patient = client.resources("Patient").search(identifier=patient_id).first()
    if not patient:
        return {"message": "Paziente non trovato"}
    return patient.serialize()
