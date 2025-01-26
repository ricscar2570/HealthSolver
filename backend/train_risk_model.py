import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
from joblib import dump

# Caricamento del dataset
df = pd.read_csv("datasets/patient_data.csv")

# Feature e target
X = df[["age", "bmi", "condition_severity", "comorbidities_count"]]
y = df["risk_score"]

# Divisione train-test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modello Gradient Boosting
model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)

# Valutazione
y_pred_proba = model.predict_proba(X_test)[:, 1]
print(f"AUC-ROC: {roc_auc_score(y_test, y_pred_proba):.2f}")

# Salvataggio del modello
dump(model, "models/saved_models/risk_model.pkl")
