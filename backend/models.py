import os
import logging
from joblib import load

MODEL_PATH = "models/saved_models/therapy_model.pkl"

# Carica il modello addestrato
if os.path.exists(MODEL_PATH):
    model = load(MODEL_PATH)
    logging.info("✅ Modello caricato con successo!")
else:
    logging.error("❌ Errore: Modello non trovato!")
    model = None

def predict_therapy(data):
    if model is None:
        raise Exception("Modello non caricato correttamente")
    return model.predict([data])[0]
