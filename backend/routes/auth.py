"""Deprecated authentication route placeholders.

The active HealthSolver Research Edition is browser-only and does not expose a
server-side account system. The historical endpoints remain import-safe and
explicitly return 501 instead of depending on incomplete authentication code.
"""
from fastapi import APIRouter, HTTPException

router = APIRouter()

def unavailable():
    raise HTTPException(
        status_code=501,
        detail="Legacy authentication is not configured in the browser-based HealthSolver Research Edition.",
    )

@router.post("/register")
async def register(username: str, password: str):
    unavailable()

@router.post("/login")
async def login(username: str, password: str):
    unavailable()

@router.get("/user/{username}")
async def get_user_info(username: str):
    unavailable()
