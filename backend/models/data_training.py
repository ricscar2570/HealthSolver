from sklearn.ensemble import GradientBoostingClassifier
import pandas as pd
import joblib
from sqlalchemy.orm import Session
from backend.database import SessionLocal, Patient

def get_training_data(session: Session):
    records = session.query(Patient).all()
    data = [{
        "age": p.age,
        "has_diabetes": int("diabetes" in (p.medical_history or {})),
        "target": int("therapy_successful" in (p.medical_history or {}))
    } for p in records]
    return pd.DataFrame(data)

def train_model():
    session = SessionLocal()
    df = get_training_data(session)
    session.close()

    if df.empty:
        raise ValueError("No data available for training")

    X = df.drop(columns=["target"])
    y = df["target"]
    model = GradientBoostingClassifier()
    model.fit(X, y)
    joblib.dump(model, "models/therapy_model.pkl")
    print("✅ ML model trained and saved.")
