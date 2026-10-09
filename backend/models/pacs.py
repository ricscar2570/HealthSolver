import os

import requests
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

router = APIRouter()
PACS_URL = os.getenv("HEALTHSOLVER_PACS_URL", "http://localhost:8042/dicom-web").rstrip("/")
PACS_TIMEOUT_SECONDS = float(os.getenv("HEALTHSOLVER_PACS_TIMEOUT_SECONDS", "10"))


def _get(path: str, *, headers=None):
    try:
        response = requests.get(
            f"{PACS_URL}{path}",
            headers=headers,
            timeout=PACS_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail="Legacy PACS service unavailable.") from exc


@router.get("/studies")
def get_studies():
    """Retrieve study identifiers from the configured legacy PACS."""
    return _get("/studies").json()


@router.get("/study/{study_id}/series")
def get_series(study_id: str):
    """Retrieve series associated with one PACS study."""
    return _get(f"/studies/{study_id}/series").json()


@router.get("/instance/{instance_id}")
def get_image(instance_id: str):
    """Retrieve the first rendered DICOM frame as PNG."""
    response = _get(
        f"/instances/{instance_id}/frames/1/rendered",
        headers={"Accept": "image/png"},
    )
    return Response(content=response.content, media_type="image/png")
