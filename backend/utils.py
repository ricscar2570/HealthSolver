import logging
from logging.handlers import RotatingFileHandler
from cryptography.fernet import Fernet

logger = logging.getLogger("healthsolver")
handler = RotatingFileHandler("logs/app.log", maxBytes=2000, backupCount=5)
logger.setLevel(logging.INFO)
logger.addHandler(handler)

def log_request(endpoint, data):
    logger.info(f"Endpoint: {endpoint}, Data: {data}")

SECRET_ENCRYPTION_KEY = Fernet.generate_key()
cipher = Fernet(SECRET_ENCRYPTION_KEY)

def encrypt_data(data: str) -> str:
    return cipher.encrypt(data.encode()).decode()

def decrypt_data(data: str) -> str:
    return cipher.decrypt(data.encode()).decode()
