# backend/utils.py
import logging
import os
import csv
from io import StringIO
from cryptography.fernet import Fernet, InvalidToken

# Usa il logger configurato centralmente
logger = logging.getLogger(__name__)
audit_logger = logging.getLogger("audit") # Logger specifico per audit
# Assicurati che l'handler per "audit.log" sia configurato in logging_config.py

# --- Crittografia ---
# CARICA LA CHIAVE DA VARIABILE D'AMBIENTE! DEVE ESSERE LA STESSA OGNI VOLTA.
# Genera una chiave UNA SOLA VOLTA con Fernet.generate_key() e mettila
# in una variabile d'ambiente sicura (es. .env file, K8s secret).
SECRET_ENCRYPTION_KEY_STR = os.getenv("APP_SECRET_KEY")
if not SECRET_ENCRYPTION_KEY_STR:
    logger.critical("FATAL: APP_SECRET_KEY environment variable not set. Encryption disabled/unsafe.")
    # Potresti generare una chiave temporanea per sviluppo, ma NON per produzione
    # SECRET_ENCRYPTION_KEY = Fernet.generate_key()
    # logger.warning("Generated temporary encryption key. DO NOT USE IN PRODUCTION.")
    cipher = None # Disabilita cifratura se chiave non presente
else:
    try:
        SECRET_ENCRYPTION_KEY = SECRET_ENCRYPTION_KEY_STR.encode() # Fernet richiede bytes
        cipher = Fernet(SECRET_ENCRYPTION_KEY)
        logger.info("Encryption cipher initialized successfully.")
    except Exception as e:
        logger.critical(f"FATAL: Failed to initialize cipher from APP_SECRET_KEY: {e}")
        cipher = None

def encrypt_data(data: bytes) -> bytes | None:
    """ Cripta dati usando la chiave globale. """
    if not cipher:
        logger.error("Encryption skipped: Cipher not available.")
        return None
    try:
        return cipher.encrypt(data)
    except Exception as e:
        logger.exception("Encryption failed.")
        return None

def decrypt_data(token: bytes) -> bytes | None:
    """ Decripta dati usando la chiave globale. """
    if not cipher:
        logger.error("Decryption skipped: Cipher not available.")
        return None
    try:
        return cipher.decrypt(token)
    except InvalidToken:
        logger.error("Decryption failed: Invalid token.")
        return None
    except Exception as e:
        logger.exception("Decryption failed.")
        return None

# --- Audit Logging ---
def log_audit(action: str, user: str, data_accessed: str):
    """ Logga un evento di audit. """
    # Non serve configurare logger qui, usa quello ottenuto con getLogger
    audit_logger.info(f"Action='{action}', User='{user}', Data='{data_accessed}'")

# --- Anonimizzazione ---
def anonymize_data(data: dict) -> dict:
    """ Semplice funzione di anonimizzazione (esempio). """
    # Questa è una funzione di esempio, l'anonimizzazione reale è complessa.
    anonymized = data.copy()
    if "patient_id" in anonymized:
        # Esempio: Sostituisci con un hash troncato (NON sicuro per de-anonimizzazione)
        anonymized["patient_id"] = f"anon-{hash(str(anonymized['patient_id'])) % 10000}"
    if "name" in anonymized:
        anonymized["name"] = "Anonymous"
    # Aggiungere altri campi se necessario (es. date, indirizzi)
    logger.debug(f"Anonymized data for patient ID {data.get('patient_id', 'N/A')}")
    return anonymized

# --- Reportistica ---
def generate_report(data: list[dict]) -> str:
    """ Genera un report CSV dai dati forniti. """
    # Assicurati che 'data' sia una lista di dizionari con le chiavi attese
    if not data:
        return "" # Ritorna stringa vuota se non ci sono dati

    output = StringIO()
    # Definisci le colonne basandoti sulle chiavi del primo item (o definiscile staticamente)
    header = ["Patient ID", "Age", "BMI", "Severity", "Recommendation", "Risk Score"] # Esempio Header
    # Fallback se una chiave non esiste nel dizionario
    writer = csv.DictWriter(output, fieldnames=header, restval="N/A", extrasaction='ignore')

    writer.writeheader()
    for item in data:
        # Mappa i dati dell'item alle colonne dell'header
        # Questo richiede che le chiavi nell'header corrispondano (case-sensitive)
        # o che tu faccia una mappatura manuale qui.
        # Esempio di mappatura se le chiavi sono diverse:
        row_to_write = {
            "Patient ID": item.get("patient_id", "N/A"),
            "Age": item.get("age", "N/A"),
            "BMI": item.get("bmi", "N/A"),
            "Severity": item.get("condition_severity", "N/A"), # Esempio: chiave diversa
            "Recommendation": item.get("recommended_therapy", "N/A"), # Esempio: chiave diversa
            "Risk Score": item.get("risk_score", "N/A")
        }
        writer.writerow(row_to_write)

    output.seek(0)
    report_content = output.getvalue()
    logger.info(f"Generated CSV report with {len(data)} rows.")
    return report_content
