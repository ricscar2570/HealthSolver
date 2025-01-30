import pyotp
import redis
from fastapi import APIRouter, Depends, HTTPException
from backend.auth import get_current_user

router = APIRouter()
redis_client = redis.StrictRedis(host="redis", port=6379, db=0, decode_responses=True)

@router.post("/generate")
async def generate_mfa(user: dict = Depends(get_current_user)):
    """Genera un codice OTP per l'utente"""
    secret = pyotp.random_base32()
    redis_client.setex(f"mfa:{user['username']}", 300, secret)
    return {"secret": secret, "qr_code": pyotp.totp.TOTP(secret).provisioning_uri(user['username'], issuer_name="HealthSolver")}

@router.post("/verify")
async def verify_mfa(code: str, user: dict = Depends(get_current_user)):
    """Verifica il codice OTP inserito dall'utente"""
    secret = redis_client.get(f"mfa:{user['username']}")
    if not secret or not pyotp.TOTP(secret).verify(code):
        raise HTTPException(status_code=403, detail="Invalid OTP")
    return {"message": "MFA verified successfully"}
