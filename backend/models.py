from joblib import load
model = load('models/saved_models/example_model.pkl')
def predict(data):
    return model.predict(data)