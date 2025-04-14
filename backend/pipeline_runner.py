from backend.models.data_training import train_model
from backend.utils.cache import cache_json
from backend.database import SessionLocal, Patient

def run_pipeline():
    print("🚀 Starting full pipeline...")

    # Train model
    train_model()

    # Cache patient stats
    session = SessionLocal()
    patient_count = session.query(Patient).count()
    avg_age = session.query(Patient.age).all()
    session.close()

    cache_json("stats", {"total_patients": patient_count, "notes": "pipeline run completed"})

    print("✅ Pipeline completed.")
