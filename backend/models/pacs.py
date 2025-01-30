import requests
from fastapi import APIRouter, HTTPException

router = APIRouter()
PACS_URL = "http://localhost:8042/dicom-web"

@router.get("/studies")
async def get_studies():
    """Recupera gli ID degli studi disponibili nel PACS"""
    response = requests.get(f"{PACS_URL}/studies")
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Errore nel recupero degli studi PACS")
    return response.json()

@router.get("/study/{study_id}/series")
async def get_series(study_id: str):
    """Recupera le serie di immagini associate a uno studio"""
    response = requests.get(f"{PACS_URL}/studies/{study_id}/series")
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Errore nel recupero delle serie PACS")
    return response.json()

@router.get("/instance/{instance_id}")
async def get_image(instance_id: str):
    """Scarica un'immagine DICOM in formato PNG"""
    headers = {"Accept": "image/png"}
    response = requests.get(f"{PACS_URL}/instances/{instance_id}/frames/1/rendered", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Errore nel recupero dell'immagine DICOM")
    
    return response.content
