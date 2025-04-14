# backend/utils/logging_config.py
import logging
import sys
import os
from logging.handlers import RotatingFileHandler

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True) # Assicura che la directory esista

# Livello di logging (può essere configurato da env var)
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
numeric_level = getattr(logging, LOG_LEVEL, None)
if not isinstance(numeric_level, int):
    numeric_level = logging.INFO # Default a INFO se env var non valida

LOG_FORMAT = "%(asctime)s - %(levelname)s - [%(name)s] - %(message)s (%(filename)s:%(lineno)d)"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Configurazione di base per tutti i logger
logging.basicConfig(
    level=numeric_level,
    format=LOG_FORMAT,
    datefmt=DATE_FORMAT,
    handlers=[logging.StreamHandler(sys.stdout)] # Logga anche a console di default
)

def setup_logging():
    """ Configura logging aggiuntivo (es. file rotation) se necessario. """
    root_logger = logging.getLogger() # Prendi il logger root

    # Rimuovi eventuali handler pre-esistenti se vuoi controllo totale
    # for handler in root_logger.handlers[:]:
    #    root_logger.removeHandler(handler)

    # Aggiungi handler per console (se non già presente o rimosso)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(LOG_FORMAT, DATE_FORMAT))
    # root_logger.addHandler(console_handler) # Aggiungi se hai rimosso handlers

    # Aggiungi handler per file rotante (app.log)
    log_file_path = os.path.join(LOG_DIR, "app.log")
    file_handler = RotatingFileHandler(log_file_path, maxBytes=5*1024*1024, backupCount=5) # 5 MB per file
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT, DATE_FORMAT))
    root_logger.addHandler(file_handler)

    # Configura handler specifici se necessario (es. per Audit o Alert)
    # Esempio: Handler per Alert (WARNING e sopra) in un file separato
    alert_file_path = os.path.join(LOG_DIR, "alerts.log")
    alert_handler = RotatingFileHandler(alert_file_path, maxBytes=2*1024*1024, backupCount=3)
    alert_handler.setFormatter(logging.Formatter("%(asctime)s - ALERT - %(message)s", DATE_FORMAT))
    alert_handler.setLevel(logging.WARNING) # Logga solo WARNING e sopra
    # Aggiungi questo handler solo ai logger specifici che devono scrivere qui
    # Oppure aggiungilo al root logger se vuoi che tutti gli alert finiscano qui
    # root_logger.addHandler(alert_handler) # Sconsigliato se vuoi log separati

    logging.info(f"Logging initialized. Level: {LOG_LEVEL}. Log file: {log_file_path}")

# Nota: La configurazione in models.py per alerts.log è ora gestita qui (se decommenti alert_handler)
# o puoi creare un logger specifico e aggiungerci l'handler.
# Rimuovi le chiamate a logging.basicConfig da altre parti del codice (es. models.py).
