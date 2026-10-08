"""Compatibility guard for the deprecated backend authentication prototype.

The current HealthSolver Research Edition is browser-only and does not expose the
legacy FastAPI authentication/MFA stack. This module exists so historical route
modules remain importable without pretending that authentication is configured.
"""

from fastapi import HTTPException


async def get_current_user():
    """Reject use of the unconfigured legacy authentication subsystem."""
    raise HTTPException(
        status_code=501,
        detail="Legacy authentication is not configured in the browser-based HealthSolver Research Edition.",
    )
