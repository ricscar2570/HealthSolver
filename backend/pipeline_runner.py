import logging

from sqlalchemy import func

from backend.models.data_training import train_model
from backend.utils.cache import cache_json
from backend.database import SessionLocal, Patient

logger = logging.getLogger(__name__)


def run_pipeline():
    """Run the legacy local training/caching pipeline.

    This belongs to the pre-browser backend. Fatal training errors are re-raised
    so callers and tests cannot mistake a failed pipeline for success.
    """
    logger.info("Starting full legacy pipeline...")
    try:
        train_model()
        logger.info("Model training completed.")

        session = SessionLocal()
        try:
            patient_count = session.query(Patient).count()
            avg_age_result = session.query(func.avg(Patient.age)).scalar()
            avg_age = round(avg_age_result, 1) if avg_age_result is not None else None
            stats_data = {
                "total_patients": patient_count,
                "average_age": avg_age,
                "notes": "legacy pipeline run completed successfully",
            }
            cache_json("stats", stats_data)
        finally:
            session.close()

        logger.info("Legacy pipeline completed successfully.")
    except Exception:
        logger.exception("Legacy pipeline execution failed.")
        raise


if __name__ == "__main__":
    from backend.utils.logging_config import setup_logging

    setup_logging()
    run_pipeline()
