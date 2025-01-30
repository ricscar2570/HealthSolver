from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_user, create_user, verify_password, create_access_token
from backend.utils.cache import cache_response

router = APIRouter()

@router.post("/register")
async def register(username: str, password: str):
    """Registra un nuovo utente"""
    if get_user(username):
        raise HTTPException(status_code=400, detail="Username already taken")
    create_user(username, password)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(username: str, password: str):
    """Effettua il login e restituisce un JWT token"""
    user = get_user(username)
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/user/{username}")
@cache_response(expiration_time=300)
async def get_user_info(username: str):
    """Recupera informazioni sull'utente con caching"""
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
