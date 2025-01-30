import os
import logging
import time
from joblib import load
from prometheus_client import Counter, Histogram, Gauge

MODEL_PATH = "models/saved_models/therapy_model.pkl"

# Configura il logging degli alert
logging.basicConfig(
    filename="logs/alerts.log",
    level=logging.WARNING,
    format="%(asctime)s - ALERT - %(message)s",
)

# Inizializza metriche Prometheus
PREDICTION_COUNT = Counter("ml_predictions_total", "Numero totale di predizioni effettuate")
PREDICTION_TIME = Histogram("ml_prediction_duration_seconds", "Tempo di inferenza del modello")
MAX_PREDICTION_TIME = Gauge("ml_max_prediction_time", "Tempo massimo registrato per una inferenza")
CLASS_DISTRIBUTION = Counter("ml_class_distribution", "Distribuzione delle classi predette", ["class_label"])

# Carica il modello
if os.path.exists(MODEL_PATH):
    model = load(MODEL_PATH)
    logging.info("✅ Modello caricato con successo!")
else:
    logging.error("❌ Errore: Modello non trovato!")
    model = None

def predict_therapy(data):
    """Effettua una predizione con il modello ML e traccia metriche."""
    if model is None:
        raise Exception("Modello non caricato correttamente")

    start_time = time.time()
    prediction = model.predict([data])[0]
    duration = time.time() - start_time

    # Registra metriche
    PREDICTION_COUNT.inc()
    PREDICTION_TIME.observe(duration)
    MAX_PREDICTION_TIME.set(max(MAX_PREDICTION_TIME._value.get(), duration))  # Aggiorna se il valore è più alto
    CLASS_DISTRIBUTION.labels(class_label=str(prediction)).inc()

    # Se il tempo di inferenza supera 1s, registra un alert
    if duration > 1:
        alert_message = f"Inferenza lenta: {duration:.2f}s per input {data}"
        logging.warning(alert_message)

    return prediction
