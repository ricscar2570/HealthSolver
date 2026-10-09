import os

from fastapi import APIRouter, HTTPException
from fhirpy import SyncFHIRClient

router = APIRouter()
FHIR_BASE_URL = os.getenv("HEALTHSOLVER_FHIR_BASE_URL", "").strip()


def _get_client() -> SyncFHIRClient:
    if not FHIR_BASE_URL:
        raise HTTPException(
            status_code=503,
            detail="Legacy FHIR endpoint is not configured.",
        )
    return SyncFHIRClient(FHIR_BASE_URL.rstrip("/"))


@router.get("/patient/{patient_id}")
def get_patient_data(patient_id: str):
    """Retrieve one patient from an explicitly configured legacy FHIR endpoint."""
    normalized_id = patient_id.strip()
    if not normalized_id:
        raise HTTPException(status_code=400, detail="Patient identifier is required.")

    client = _get_client()
    try:
        patient = client.resources("Patient").search(identifier=normalized_id).first()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Configured legacy FHIR service is unavailable.",
        ) from exc

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return patient.serialize()
