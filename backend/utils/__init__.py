"""Small compatibility utilities for the deprecated server-side prototype.

The active HealthSolver Research Edition is browser-only. These helpers remain
for historical/local development and avoid initializing optional security
services merely by importing the package.
"""
import csv
import hashlib
import logging
import os
from io import StringIO

from cryptography.fernet import Fernet, InvalidToken

logger = logging.getLogger(__name__)
audit_logger = logging.getLogger("audit")


def _cipher():
    """Create the legacy Fernet cipher only when encryption is actually used."""
    raw = os.getenv("APP_SECRET_KEY", "").strip()
    if not raw:
        return None
    try:
        return Fernet(raw.encode())
    except Exception:
        logger.exception("Invalid APP_SECRET_KEY for legacy Fernet encryption.")
        return None


def encrypt_data(data: bytes) -> bytes | None:
    cipher = _cipher()
    if cipher is None:
        logger.error("Legacy encryption unavailable: APP_SECRET_KEY is not configured.")
        return None
    try:
        return cipher.encrypt(data)
    except Exception:
        logger.exception("Legacy encryption failed.")
        return None


def decrypt_data(token: bytes) -> bytes | None:
    cipher = _cipher()
    if cipher is None:
        logger.error("Legacy decryption unavailable: APP_SECRET_KEY is not configured.")
        return None
    try:
        return cipher.decrypt(token)
    except InvalidToken:
        logger.error("Legacy decryption failed: invalid token.")
        return None
    except Exception:
        logger.exception("Legacy decryption failed.")
        return None


def log_audit(action: str, user: str, data_accessed: str):
    audit_logger.info("Action=%r, User=%r, Data=%r", action, user, data_accessed)


def anonymize_data(data: dict) -> dict:
    """Legacy deterministic pseudonymization helper.

    This is not a claim of regulatory-grade anonymization. A deployment-specific
    ANONYMIZATION_SALT should be supplied when the old backend is used locally.
    """
    anonymized = data.copy()
    if "patient_id" in anonymized:
        salt = os.getenv("ANONYMIZATION_SALT", "healthsolver-legacy-local")
        raw = f"{salt}:{anonymized['patient_id']}".encode()
        anonymized["patient_id"] = "anon-" + hashlib.sha256(raw).hexdigest()[:16]
    if "name" in anonymized:
        anonymized["name"] = "Anonymous"
    return anonymized


def generate_report(data: list[dict]) -> str:
    if not data:
        return ""

    output = StringIO()
    header = ["Patient ID", "Age", "BMI", "Severity", "Recommendation", "Risk Score"]
    writer = csv.DictWriter(output, fieldnames=header, restval="N/A", extrasaction="ignore")
    writer.writeheader()
    for item in data:
        writer.writerow(
            {
                "Patient ID": item.get("patient_id", "N/A"),
                "Age": item.get("age", "N/A"),
                "BMI": item.get("bmi", "N/A"),
                "Severity": item.get("condition_severity", "N/A"),
                "Recommendation": item.get("recommended_therapy", "N/A"),
                "Risk Score": item.get("risk_score", "N/A"),
            }
        )
    return output.getvalue()
