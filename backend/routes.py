from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from jose import jwt, JWTError
from app.models import predict_therapy, predict_risk, preprocess_and_add_features
from app.utils import encrypt_data, decrypt_data
import requests

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

router = APIRouter()

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != "demo" or form_data.password != "password":
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/recommendation/")
async def recommendation(patient_data: dict):
    processed_data = preprocess_and_add_features(patient_data)
    return {"recommendation": predict_therapy(processed_data)}

@router.post("/risk_analysis/")
async def risk_analysis(therapy_data: dict):
    processed_data = preprocess_and_add_features(therapy_data)
    return {"risk_score": predict_risk(processed_data)}

@router.get("/patients/history/")
async def get_patient_history():
    return [
        {"patient_id": 1, "name": "John Doe", "history": ["Therapy A", "Therapy B"]},
        {"patient_id": 2, "name": "Jane Smith", "history": ["Therapy C"]}
    ]

@router.post("/alternative_therapies/")
async def alternative_therapies(data: dict):
    alternatives = ["Therapy A", "Therapy B", "Therapy C"]
    return {"alternatives": [alt for alt in alternatives if alt != data.get("current_therapy", "")]}

@router.post("/secure-data/")
async def secure_data_endpoint(data: dict):
    encrypted = encrypt_data(data["sensitive_info"])
    return {"encrypted_data": encrypted}

@router.post("/decrypt-data/")
async def decrypt_data_endpoint(data: dict):
    decrypted = decrypt_data(data["encrypted_info"])
    return {"decrypted_data": decrypted}

@router.get("/ehr/patient/{patient_id}")
async def get_patient_data(patient_id: str):
    fhir_url = f"https://fhirserver.example.com/Patient/{patient_id}"
    response = requests.get(fhir_url)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch patient data")
