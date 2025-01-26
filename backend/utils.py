import logging
from logging.handlers import RotatingFileHandler
from cryptography.fernet import Fernet
import csv
from io import StringIO

logger = logging.getLogger("healthsolver")
handler = RotatingFileHandler("logs/app.log", maxBytes=2000, backupCount=5)
logger.setLevel(logging.INFO)
logger.addHandler(handler)

SECRET_ENCRYPTION_KEY = Fernet.generate_key()
cipher = Fernet(SECRET_ENCRYPTION_KEY)

def log_audit(action: str, user: str, data_accessed: str):
    audit_logger = logging.getLogger("audit")
    audit_handler = RotatingFileHandler("logs/audit.log", maxBytes=5000, backupCount=5)
    audit_logger.setLevel(logging.INFO)
    audit_logger.addHandler(audit_handler)
    audit_logger.info(f"Action: {action}, User: {user}, Data: {data_accessed}")

def anonymize_data(data):
    anonymized = data.copy()
    if "patient_id" in anonymized:
        anonymized["patient_id"] = f"anon-{hash(anonymized['patient_id']) % 10000}"
    if "name" in anonymized:
        anonymized["name"] = "Anonymous"
    return anonymized

def generate_report(data):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Patient ID", "Age", "BMI", "Severity", "Recommendation", "Risk Score"])
    for item in data:
        writer.writerow([item["patient_id"], item["age"], item["bmi"], item["severity"], item["recommendation"], item["risk_score"]])
    output.seek(0)
    return output.getvalue()
