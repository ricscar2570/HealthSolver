# 🧠 HealthSolver - AI Medical Decision Support System

![HealthSolver Banner](https://img.shields.io/badge/AI--Powered-Medical%20App-blue?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-informational?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-%E2%9C%85-green?style=flat-square)
![React](https://img.shields.io/badge/React-Frontend-blue?style=flat-square)
![Streamlit](https://img.shields.io/badge/Dashboard-Streamlit-orange?style=flat-square)

---

## 💡 Overview

**HealthSolver** è una piattaforma intelligente per il supporto alle decisioni cliniche, progettata per aiutare medici e operatori sanitari a:
- Ricevere **suggerimenti terapeutici personalizzati** grazie a modelli di machine learning.
- Analizzare immagini DICOM con reti neurali convoluzionali (CNN).
- Visualizzare previsioni e statistiche cliniche in tempo reale.
- Consultare la spiegazione delle decisioni AI (Explainable AI con SHAP).



## 🚀 Come Avviare il Progetto

### 🔁 Clona il Repository
```bash
git clone https://github.com/tuo-utente/HealthSolver.git
cd HealthSolver
```
⚡ Avvio in GitHub Codespaces (Raccomandato)

    💡 L'ambiente sarà configurato e avviato automaticamente.

    Apri il progetto su GitHub.

    Clicca su Code → Codespaces → Create codespace on main.

    Attendi il setup automatico.
    ✅ Al termine, troverai:

    Backend su http://localhost:8000

    Frontend React su http://localhost:3000

    Dashboard AI su http://localhost:8501

💻 Avvio Manuale in Locale
1. Requisiti

    Docker & Docker Compose

    Node.js (v18+) e npm

    Python 3.10+

2. Installa le dipendenze

# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..

3. Avvia tutto con Docker

docker-compose up --build

4. Accedi ai servizi
Servizio	URL
API Backend	http://localhost:8000
Frontend UI	http://localhost:3000
Dashboard AI	http://localhost:8501
📦 Struttura del Progetto

HealthSolver/
├── backend/            ← API FastAPI + ML
├── frontend/           ← React UI
├── dashboard/          ← Streamlit per analisi interattiva
├── datasets/           ← Dati clinici (CSV)
├── deployments/        ← docker-compose + Kubernetes
├── .env                ← Variabili di ambiente
├── README.md           ← Documentazione (questo file)

⚙️ Tecnologie Utilizzate

    FastAPI · API REST performanti

    React · Frontend interattivo

    Streamlit · Dashboard medica AI

    PyTorch, Scikit-Learn, SHAP · Modelli AI spiegabili

    PostgreSQL + Redis · Persistenza e caching

    Docker & Kubernetes · Deployment scalabile

🔐 Sicurezza

    Autenticazione con OAuth2 + JWT

    Multi-Factor Authentication (MFA)

    Log sicuri con Blockchain Audit (opzionale)

📈 Funzionalità Avanzate

    ✔️ Suggerimenti terapeutici con ML

    ✔️ Explainable AI con SHAP

    ✔️ Analisi DICOM via CNN

    ✔️ Dashboard clinica predittiva

    ✔️ Notifiche in tempo reale via WebSocket

    ✔️ Integrazione con EHR / PACS

🛡 Disclaimer

    ⚠️ HealthSolver è uno strumento di supporto clinico e non sostituisce in alcun modo la valutazione di un medico. Utilizzare solo in ambienti controllati e a scopo sperimentale.

🤝 Contribuisci!

Pull request e segnalazioni sono benvenute.
📬 Contattami su GitHub o email per collaborazioni professionali.
🧪 Licenza

Distribuito con licenza MIT.
© 2024 – Progetto HealthSolver
