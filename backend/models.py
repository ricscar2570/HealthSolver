# backend/models.py
import os
import logging # Importa logging standard
import time
from joblib import load
from prometheus_client import Counter, Histogram, Gauge

# Usa il logger configurato centralmente
logger = logging.getLogger(__name__) # Usa il nome del modulo come logger name
alert_logger = logging.getLogger("alerts") # Logger specifico per alert (opzionale)
# Assicurati che l'handler per "alerts.log" sia configurato in logging_config.py
# e aggiunto al logger "alerts" o al root logger con un filtro appropriato.

MODEL_DIR = "models/saved_models"
MODEL_PATH = os.path.join(MODEL_DIR, "therapy_model.pkl")

# Rimuovi questa riga:
# logging.basicConfig(...)

# Inizializza metriche Prometheus
PREDICTION_COUNT = Counter("ml_predictions_total", "Numero totale di predizioni effettuate")
PREDICTION_TIME = Histogram("ml_prediction_duration_seconds", "Tempo di inferenza del modello")
MAX_PREDICTION_TIME = Gauge("ml_max_prediction_time", "Tempo massimo registrato per una inferenza")
CLASS_DISTRIBUTION = Counter("ml_class_distribution", "Distribuzione delle classi predette", ["class_label"])

# Carica il modello
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = load(MODEL_PATH)
        logger.info("✅ Therapy prediction model loaded successfully!")
    except Exception as e:
        logger.exception(f"❌ Error loading model from {MODEL_PATH}")
else:
    logger.error(f"❌ Model file not found at {MODEL_PATH}!")

def predict_therapy(data):
    """ Effettua una predizione con il modello ML e traccia metriche. """
    global model # Assicurati di usare il modello globale
    if model is None:
        logger.error("Prediction attempt failed: Model is not loaded.")
        raise Exception("Model not loaded correctly")

    start_time = time.time()
    try:
        # Assumi che 'data' sia una lista o array di feature nell'ordine corretto
        # Il modello si aspetta un input 2D (es. [data] se data è una singola riga)
        if not isinstance(data, list):
             # Potrebbe essere necessario convertire/validare 'data' qui
             raise TypeError("Input data must be a list of features")

        prediction = model.predict([data])[0] # Assicurati che l'input sia 2D
        duration = time.time() - start_time
        logger.info(f"Prediction successful for input data. Duration: {duration:.4f}s")

        # Registra metriche Prometheus
        PREDICTION_COUNT.inc()
        PREDICTION_TIME.observe(duration)
        # Ottieni il valore corrente del gauge in modo sicuro
        current_max_time = MAX_PREDICTION_TIME._value.get() # Accesso interno, ma comune
        if duration > current_max_time:
             MAX_PREDICTION_TIME.set(duration) # Aggiorna solo se è più alto
        CLASS_DISTRIBUTION.labels(class_label=str(prediction)).inc()

        # Se il tempo di inferenza supera 1s, registra un alert
        if duration > 1.0:
            alert_message = f"Slow inference detected: {duration:.2f}s for input {data}"
            # Usa il logger standard con livello WARNING o un logger specifico per alert
            logger.warning(alert_message)
            # alert_logger.warning(alert_message) # Se hai configurato alert_logger

        return prediction

    except Exception as e:
        logger.exception(f"Error during prediction for input {data}")
        raise # Rilancia l'eccezione per essere gestita dal middleware FastAPI
