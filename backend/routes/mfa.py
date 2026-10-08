"""Deprecated MFA route placeholders.

MFA belonged to the retired server-side authentication prototype. Keeping these
routes as explicit 501 responses is safer than importing an unconfigured Redis
and OTP stack.
"""
from fastapi import APIRouter, HTTPException

router = APIRouter()

def unavailable():
    raise HTTPException(
        status_code=501,
        detail="Legacy MFA is not configured in the browser-based HealthSolver Research Edition.",
    )

@router.post("/generate")
async def generate_mfa():
    unavailable()

@router.post("/verify")
async def verify_mfa(code: str):
    unavailable()
