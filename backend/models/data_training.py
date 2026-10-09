import logging
import math
import os
from pathlib import Path

import joblib
import mlflow
import mlflow.sklearn
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sqlalchemy.orm import Session

from backend.database import Patient, SessionLocal

logger = logging.getLogger(__name__)

MLFLOW_EXPERIMENT_NAME = "HealthSolver_Therapy_Prediction"
MODEL_PATH = Path(
    os.getenv(
        "HEALTHSOLVER_LEGACY_THERAPY_MODEL_PATH",
        "models/saved_models/therapy_model.pkl",
    )
)


def _configure_mlflow() -> None:
    """Configure MLflow only when the deprecated training workflow is invoked."""
    tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "").strip()
    if not tracking_uri:
        tracking_db = Path(
            os.getenv("MLFLOW_TRACKING_DB", "mlflow_data/mlflow.db")
        ).resolve()
        tracking_db.parent.mkdir(parents=True, exist_ok=True)
        tracking_uri = f"sqlite:///{tracking_db}"

    mlflow.set_tracking_uri(tracking_uri)
    mlflow.set_experiment(MLFLOW_EXPERIMENT_NAME)


def get_training_data(session: Session) -> pd.DataFrame:
    """Build the deprecated local therapy-training table from Patient rows."""
    records = session.query(Patient).all()
    if not records:
        logger.warning("No patient records found in the database for training.")
        return pd.DataFrame()

    rows = []
    for patient in records:
        history = patient.medical_history or {}
        if not isinstance(history, dict):
            logger.warning("Skipping patient %s: medical_history is not an object.", patient.id)
            continue

        rows.append(
            {
                "age": patient.age,
                "bmi": history.get("bmi"),
                "condition_severity": history.get("condition_severity"),
                "comorbidities_count": history.get("comorbidities_count", 0),
                "target": history.get("recommended_therapy"),
            }
        )

    df = pd.DataFrame(rows)
    required = ["age", "bmi", "condition_severity", "comorbidities_count", "target"]
    if df.empty:
        return df

    for column in required:
        df[column] = pd.to_numeric(df[column], errors="coerce")
    df.dropna(subset=required, inplace=True)
    logger.info("Retrieved %d valid records for deprecated local training.", len(df))
    return df


def train_model():
    """Train the deprecated local therapy classifier and log it with MLflow."""
    logger.info("Starting deprecated local model training.")
    session = SessionLocal()
    try:
        df = get_training_data(session)
    finally:
        session.close()

    if len(df) < 10:
        raise ValueError("Not enough valid data available for training.")

    features = ["age", "bmi", "condition_severity", "comorbidities_count"]
    target = "target"
    X = df[features]
    y = df[target].astype(int)

    class_counts = y.value_counts()
    if len(class_counts) < 2:
        raise ValueError("At least two target classes are required for training.")
    if int(class_counts.min()) < 2:
        raise ValueError("Each target class needs at least two observations.")

    test_rows = max(math.ceil(len(df) * 0.2), len(class_counts))
    if len(df) - test_rows < len(class_counts):
        raise ValueError("Not enough observations for a stratified train/test split.")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_rows,
        random_state=42,
        stratify=y,
    )
    logger.info("Training shape=%s test shape=%s", X_train.shape, X_test.shape)

    _configure_mlflow()
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    with mlflow.start_run():
        params = {"n_estimators": 100, "learning_rate": 0.1, "random_state": 42}
        model = GradientBoostingClassifier(**params)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        logger.info("Legacy model accuracy: %.4f", accuracy)

        mlflow.log_params(params)
        mlflow.log_metric("accuracy", accuracy)

        joblib.dump(model, MODEL_PATH)
        logger.info("Legacy model saved to %s", MODEL_PATH)

        mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="therapy_model",
            registered_model_name="HealthSolverTherapyModel",
        )
        mlflow.log_artifact(str(MODEL_PATH))

        active_run = mlflow.active_run()
        if active_run is not None:
            logger.info("MLflow run ID: %s", active_run.info.run_id)

    return {
        "status": "trained",
        "records": len(df),
        "accuracy": float(accuracy),
        "model_path": str(MODEL_PATH),
    }


if __name__ == "__main__":
    try:
        train_model()
    except ValueError as exc:
        logger.error("Training failed: %s", exc)
    except Exception:
        logger.exception("Unexpected legacy training failure.")
        raise
