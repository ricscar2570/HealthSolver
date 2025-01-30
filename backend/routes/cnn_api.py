from fastapi import APIRouter, UploadFile, File
import os
from backend.models.cnn_model import predict_dicom, cnn_model

router = APIRouter()
UPLOAD_FOLDER = "uploads"

@router.post("/analyze")
async def analyze_dicom(file: UploadFile = File(...)):
    """Analizza un'immagine DICOM per individuare anomalie"""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    result = predict_dicom(cnn_model, file_path)
    os.remove(file_path)

    return {"filename": file.filename, "analysis_result": result}
