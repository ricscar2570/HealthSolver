import mlflow
import mlflow.sklearn
import pandas as pd
import os
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
from joblib import dump

# Configura il tracciamento di MLflow
mlflow.set_tracking_uri("file:///mlflow_data")
mlflow.set_experiment("HealthSolver_ML")

# Caricamento dataset
df = pd.read_csv("datasets/patient_data.csv")
features = ["age", "bmi", "condition_severity", "comorbidities_count"]
X = df[features]
y = df["recommended_therapy"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Avvia una sessione di MLflow
with mlflow.start_run():
    model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)

    # Valutazione
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    auc_roc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])

    # Logging metriche
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("auc_roc", auc_roc)

    # Logging del modello
    model_path = "models/saved_models/therapy_model.pkl"
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    dump(model, model_path)
    mlflow.sklearn.log_model(model, "therapy_model")

    print(f"✅ Modello addestrato e salvato con MLflow! Accuracy: {accuracy:.2f}, AUC-ROC: {auc_roc:.2f}")
