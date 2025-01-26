from joblib import dump, load
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import os
import numpy as np

def preprocess_and_add_features(data):
    """
    Preprocess and add engineered features.
    """
    age = data["age"]
    bmi = data["bmi"]
    severity = data["condition_severity"]
    comorbidities = data.get("comorbidities_count", 0)

    feature_1 = age * bmi / 10
    feature_2 = severity + comorbidities
    feature_3 = (bmi ** 2) / age if age > 0 else 0

    return [age, bmi, severity, comorbidities, feature_1, feature_2, feature_3]

def load_or_create_model(path, model_type):
    if os.path.exists(path):
        return load(path)
    
    from sklearn.datasets import make_classification
    from sklearn.model_selection import train_test_split

    X, y = make_classification(
        n_samples=2000, n_features=7, random_state=42, class_sep=1.5
    )
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    if model_type == "therapy":
        model = GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, max_depth=4)
    else:
        model = GradientBoostingClassifier(n_estimators=200, learning_rate=0.05, max_depth=5)

    model.fit(X_train, y_train)
    dump(model, path)
    return model

therapy_model = load_or_create_model("models/saved_models/therapy_model.pkl", "therapy")
risk_model = load_or_create_model("models/saved_models/risk_model.pkl", "risk")

def predict_therapy(data):
    return therapy_model.predict([data])[0]

def predict_risk(data):
    return risk_model.predict_proba([data])[0][1]
