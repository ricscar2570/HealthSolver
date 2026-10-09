from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydicom.errors import InvalidDicomError
from starlette.concurrency import run_in_threadpool

from backend.models.cnn_model import LegacyCNNUnavailableError, predict_dicom

router = APIRouter()
UPLOAD_FOLDER = Path("uploads")


@router.post("/analyze")
async def analyze_dicom(file: UploadFile = File(...)):
    """Analyze a legacy DICOM upload using a bounded local temporary file."""
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

        try:
            result = await run_in_threadpool(predict_dicom, str(file_path))
        except LegacyCNNUnavailableError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        except (InvalidDicomError, ValueError) as exc:
            raise HTTPException(
                status_code=422,
                detail="Invalid or unsupported DICOM image.",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail="Legacy DICOM analysis failed.",
            ) from exc

        return {"filename": original_name, "analysis_result": result}
    finally:
        try:
            file_path.unlink(missing_ok=True)
        finally:
            await file.close()
