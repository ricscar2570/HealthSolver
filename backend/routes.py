from fastapi import APIRouter
router = APIRouter()
@router.get('/api')
def api_root():
    return {"api": "root"}
