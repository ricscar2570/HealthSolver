from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_user, create_user, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
async def register(username: str, password: str):
    if get_user(username):
        raise HTTPException(status_code=400, detail="Username already taken")
    create_user(username, password)
    return {"message": "User registered successfully"}