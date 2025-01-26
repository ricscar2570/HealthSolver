from sklearn.ensemble import GradientBoostingClassifier
from joblib import load
import shap

therapy_model = load("models/saved_models/therapy_model.pkl")
risk_model = load("models/saved_models/risk_model.pkl")

def preprocess_and_add_features(data):
    age = data["age"]
    bmi = data["bmi"]
    severity = data["condition_severity"]
    comorbidities = data.get("comorbidities_count", 0)
    feature_1 = age * bmi / 10
    feature_2 = severity + comorbidities
    feature_3 = (bmi ** 2) / age if age > 0 else 0
    return [age, bmi, severity, comorbidities, feature_1, feature_2, feature_3]

def predict_therapy(data):
    return therapy_model.predict([data])[0]

def predict_risk(data):
    return risk_model.predict_proba([data])[0][1]

def explain_therapy_prediction(data):
    explainer = shap.TreeExplainer(therapy_model)
    shap_values = explainer.shap_values([data])
    return shap_values[0]
