# backend/pipeline_runner.py
import logging
from sqlalchemy import func # Importa func per avg
from backend.models.data_training import train_model
from backend.utils.cache import cache_json
from backend.database import SessionLocal, Patient

logger = logging.getLogger(__name__)

def run_pipeline():
    """ Esegue la pipeline completa: training modello e caching statistiche. """
    logger.info("🚀 Starting full pipeline...")

    try:
        # 1. Train model
        logger.info("Initiating model training...")
        train_model() # Usa la funzione aggiornata con MLflow
        logger.info("Model training completed.")

        # 2. Cache patient stats
        logger.info("Calculating and caching patient statistics...")
        session = SessionLocal()
        try:
            patient_count = session.query(Patient).count()
            # Calcola l'età media direttamente nel database
            avg_age_result = session.query(func.avg(Patient.age)).scalar() # Usa func.avg
            avg_age = round(avg_age_result, 1) if avg_age_result is not None else None # Arrotonda e gestisci None
            logger.info(f"Total patients: {patient_count}, Average age: {avg_age}")

            # Crea il dizionario delle statistiche
            stats_data = {
                "total_patients": patient_count,
                "average_age": avg_age,
                "notes": "pipeline run completed successfully"
            }
            # Cache le statistiche
            cache_json("stats", stats_data)
            logger.info("Patient statistics cached successfully.")

        except Exception as e:
            logger.exception("Error calculating/caching patient statistics.")
            # Decidi se l'errore nelle statistiche debba fermare la pipeline
        finally:
            session.close()

        logger.info("✅ Pipeline completed successfully.")

    except Exception as e:
        logger.exception("❌ Pipeline execution failed.")
        # Qui potresti voler sollevare l'eccezione o gestire l'errore in altro modo

# Permette di eseguire lo script direttamente se necessario
if __name__ == "__main__":
    # Assicurati che il logging sia configurato se eseguito direttamente
    from backend.utils.logging_config import setup_logging
    setup_logging()
    run_pipeline()
