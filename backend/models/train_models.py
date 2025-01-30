import mlflow
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from joblib import dump

df = pd.read_csv("datasets/patient_data.csv")
features = ["age", "bmi", "condition_severity", "comorbidities_count"]
X = df[features]
y = df["recommended_therapy"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

mlflow.set_tracking_uri("file:///mlflow_data")
mlflow.set_experiment("HealthSolver_ML")

with mlflow.start_run():
    model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)
    
    dump(model, "models/saved_models/therapy_model.pkl")
    mlflow.sklearn.log_model(model, "therapy_model")
    
    print("✅ Modello addestrato e salvato con MLflow!")
