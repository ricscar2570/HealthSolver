from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.models.cnn_model import cnn_model, predict_dicom

router = APIRouter()
UPLOAD_FOLDER = Path("uploads")


@router.post("/analyze")
async def analyze_dicom(file: UploadFile = File(...)):
    """Analyze a legacy DICOM upload using a local temporary file."""
    original_name = Path(file.filename or "upload.dcm").name
    suffix = Path(original_name).suffix.lower()
    if suffix != ".dcm":
        await file.close()
        raise HTTPException(status_code=400, detail="Only .dcm files are accepted.")

    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_FOLDER / f"{uuid4().hex}.dcm"
    max_bytes = 64 * 1024 * 1024
    written = 0

    try:
        with file_path.open("wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                written += len(chunk)
                if written > max_bytes:
                    raise HTTPException(status_code=413, detail="DICOM upload exceeds 64 MiB.")
                buffer.write(chunk)

        result = predict_dicom(cnn_model, str(file_path))
        return {"filename": original_name, "analysis_result": result}
    finally:
        try:
            file_path.unlink(missing_ok=True)
        finally:
            await file.close()
