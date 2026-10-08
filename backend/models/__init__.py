"""Legacy therapy-model compatibility layer.

The current HealthSolver Research Edition uses the versioned browser models
under /predictive. The old therapy model is loaded lazily only if a legacy
endpoint is explicitly invoked.
"""
import logging
import os
import time

from joblib import load
from prometheus_client import Counter, Gauge, Histogram

logger = logging.getLogger(__name__)

MODEL_DIR = "models/saved_models"
MODEL_PATH = os.path.join(MODEL_DIR, "therapy_model.pkl")

PREDICTION_COUNT = Counter("ml_predictions_total", "Numero totale di predizioni effettuate")
PREDICTION_TIME = Histogram("ml_prediction_duration_seconds", "Tempo di inferenza del modello")
MAX_PREDICTION_TIME = Gauge("ml_max_prediction_time", "Tempo massimo registrato per una inferenza")
CLASS_DISTRIBUTION = Counter(
    "ml_class_distribution", "Distribuzione delle classi predette", ["class_label"]
)

model = None


def _get_model():
    global model
    if model is not None:
        return model
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(
            "Legacy therapy model is not installed. "
            "The browser-based Research Edition uses the models under /predictive instead."
        )
    model = load(MODEL_PATH)
    logger.info("Legacy therapy prediction model loaded from %s", MODEL_PATH)
    return model


def predict_therapy(data):
    if not isinstance(data, list):
        raise TypeError("Input data must be a list of features")

    current_model = _get_model()
    start_time = time.time()
    prediction = current_model.predict([data])[0]
    duration = time.time() - start_time

    PREDICTION_COUNT.inc()
    PREDICTION_TIME.observe(duration)
    current_max_time = MAX_PREDICTION_TIME._value.get()
    if duration > current_max_time:
        MAX_PREDICTION_TIME.set(duration)
    CLASS_DISTRIBUTION.labels(class_label=str(prediction)).inc()

    if duration > 1.0:
        logger.warning("Slow legacy inference: %.2fs", duration)
    return prediction
