# backend/models/data_training.py
import logging
import os
import pandas as pd
import joblib
import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score # Aggiungi metriche
from sqlalchemy.orm import Session
from backend.database import SessionLocal, Patient # Assumendo che Patient sia definito qui

# Configura MLflow (assicurati che la directory esista o sia creata)
MLFLOW_TRACKING_URI = "file:///mlflow_data" # O un server MLflow remoto
MLFLOW_EXPERIMENT_NAME = "HealthSolver_Therapy_Prediction"
os.makedirs(MLFLOW_TRACKING_URI.replace("file://", ""), exist_ok=True) # Crea dir locale se non esiste
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
mlflow.set_experiment(MLFLOW_EXPERIMENT_NAME)

MODEL_DIR = "models/saved_models" # Directory per salvare il modello localmente
MODEL_PATH = os.path.join(MODEL_DIR, "therapy_model.pkl")

# Assicurati che la directory del modello esista
os.makedirs(MODEL_DIR, exist_ok=True)

def get_training_data(session: Session) -> pd.DataFrame:
    """ Recupera e pre-processa i dati per il training dal database. """
    records = session.query(Patient).all()
    if not records:
        logging.warning("No patient records found in the database for training.")
        return pd.DataFrame()

    data = []
    for p in records:
        # Estrai feature rilevanti dalla storia medica (esempio)
        # Questo dipende MOLTO da come è strutturato il JSON 'medical_history'
        history = p.medical_history or {}
        # Esempio: Assumiamo che 'history' contenga queste chiavi
        # Devi adattare questa logica alla tua struttura dati REALE
        data.append({
            "age": p.age,
            "bmi": history.get("bmi", None), # Esempio: prendi BMI da history
            "condition_severity": history.get("condition_severity", None), # Esempio
            "comorbidities_count": history.get("comorbidities_count", 0), # Esempio
            # Assumiamo che la 'target' sia la terapia raccomandata/applicata
            # o un outcome. ADATTARE QUESTO ALLA LOGICA REALE.
            "target": history.get("recommended_therapy", None) # Esempio Target
        })

    df = pd.DataFrame(data)
    # Rimuovi righe con valori mancanti nelle feature o nel target
    # Potrebbe essere necessaria una gestione più sofisticata dell'imputazione
    df.dropna(subset=["age", "bmi", "condition_severity", "comorbidities_count", "target"], inplace=True)
    logging.info(f"Retrieved {len(df)} preprocessed records for training.")
    return df

def train_model():
    """ Addestra il modello di raccomandazione terapia e logga con MLflow. """
    logging.info("Starting model training...")
    session = SessionLocal()
    df = get_training_data(session)
    session.close()

    if df.empty or len(df) < 10: # Aggiungi controllo sulla dimensione minima
        logging.error("Not enough valid data available for training. Aborting.")
        raise ValueError("Not enough valid data available for training.")

    # Definisci features e target (basato su get_training_data)
    features = ["age", "bmi", "condition_severity", "comorbidities_count"]
    target = "target" # Assicurati che corrisponda alla colonna in get_training_data

    X = df[features]
    y = df[target]

    # Split Train/Test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) > 1 else None)
    logging.info(f"Training data shape: {X_train.shape}, Test data shape: {X_test.shape}")

    # Avvia run MLflow
    with mlflow.start_run():
        # Definisci e addestra il modello
        # Puoi parametrizzare questi iperparametri
        params = {"n_estimators": 100, "learning_rate": 0.1, "random_state": 42}
        model = GradientBoostingClassifier(**params)
        model.fit(X_train, y_train)

        # Valuta il modello
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        logging.info(f"Model Accuracy: {accuracy:.4f}")

        # Logga parametri e metriche con MLflow
        mlflow.log_params(params)
        mlflow.log_metric("accuracy", accuracy)
        # Aggiungi altre metriche se rilevanti (es. precision, recall, AUC se applicabile)

        # Salva il modello localmente
        joblib.dump(model, MODEL_PATH)
        logging.info(f"Model saved locally to {MODEL_PATH}")

        # Logga il modello con MLflow
        mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="therapy_model", # Nome artefatto in MLflow
            registered_model_name="HealthSolverTherapyModel" # Nome opzionale nel Model Registry
        )
        mlflow.log_artifact(MODEL_PATH) # Logga anche il file .pkl direttamente

        logging.info(f"✅ ML model trained and logged to MLflow. Run ID: {mlflow.active_run().info.run_id}")

    print("✅ ML model training pipeline finished.") # Output per pipeline_runner

# Permette di eseguire lo script direttamente se necessario
if __name__ == "__main__":
    try:
        train_model()
    except ValueError as e:
        logging.error(f"Training failed: {e}")
    except Exception as e:
        logging.exception("An unexpected error occurred during training.")
