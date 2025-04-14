# 🧠 HealthSolver - AI Medical Decision Support System

![HealthSolver Banner](https://img.shields.io/badge/AI--Powered-Medical%20App-blue?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-informational?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-%E2%9C%85-green?style=flat-square)
![React](https://img.shields.io/badge/React-Frontend-blue?style=flat-square)
![Streamlit](https://img.shields.io/badge/Dashboard-Streamlit-orange?style=flat-square)

---

Benvenuto/a in **HealthSolver**! Questo progetto non è il solito software medico noioso. È un ecosistema completo basato su AI, progettato per supportare i professionisti sanitari nell'analisi dei dati dei pazienti, nella raccomandazione di terapie e molto altro. Il tutto condito con un pizzico di tecnologia moderna e monitoraggio avanzato!

---

## 🚀 Funzionalità Principali

* **🧠 Backend Intelligente (FastAPI):** API robuste per predizioni ML, analisi dati, gestione alert e integrazioni (potenziali) con PACS/EHR.
* **🎨 Frontend Interattivo (React):** Interfaccia utente per inserire dati, visualizzare risultati, analizzare immagini e ricevere raccomandazioni.
* **📊 Dashboard Dinamica (Streamlit):** Visualizzazione aggregata dei dati dei pazienti e delle previsioni AI.
* **🤖 Modelli Machine Learning:**
    * Predizione di terapie raccomandate basate sui dati del paziente.
    * (Potenziale) Analisi di immagini mediche (DICOM) tramite CNN.
* **⚙️ Pipeline Dati & Training:** Script per ri-addestrare i modelli ML.
* **🔔 Monitoraggio & Alerting (Prometheus, Grafana, Alertmanager):** Teniamo d'occhio le performance dell'API e del modello, con alert via email per eventi critici (come inferenze lente!).
* **🐳 Containerizzazione Completa (Docker):** Tutto l'ambiente (backend, frontend, DB, monitoring) è gestito tramite Docker Compose per un setup facile e replicabile.
* **🧪 Test:** Include unit test e integration test (basati su Pytest) per garantire l'affidabilità.

---

## 🛠️ Stack Tecnologico

Questo progetto è un cocktail di tecnologie moderne:

* **Backend:** Python, FastAPI, SQLAlchemy, Uvicorn, Joblib, Scikit-learn, MLflow, Pandas, Pydantic, Pytest
* **Frontend:** JavaScript, React, Chart.js, i18next
* **Dashboard:** Streamlit, Plotly
* **Database/Cache:** SQLite (default), Redis
* **Monitoraggio:** Prometheus, Grafana, Alertmanager
* **Containerizzazione:** Docker, Docker Compose
* **(Potenziale Integrazione):** PyTorch (per CNN), Pydicom, FHIRpy
* **CI/CD & Deployment (Esempi):** Kubernetes (manifests in `deployments/`)

---

## ⚙️ Setup & Configurazione: Pronti, Partenza... Via!

Mettere in moto HealthSolver è facile come bere un bicchier d'acqua (filtrata, ovviamente 😉).

### Prerequisiti

Assicurati di avere installato:

1.  **Docker:** [Installa Docker](https://docs.docker.com/get-docker/)
2.  **Docker Compose:** Di solito incluso con Docker Desktop, altrimenti [Installa Docker Compose](https://docs.docker.com/compose/install/)

### 🔑 Variabili d'Ambiente: La Chiave di Tutto!

Alcune configurazioni sensibili o specifiche dell'ambiente sono gestite tramite variabili d'ambiente. Il modo più semplice è creare un file `.env` nella directory principale del progetto.

**1. Crea il file `.env`:**

```bash
touch .env

2. Aggiungi le seguenti variabili al file .env:

Copia e incolla il blocco sottostante nel tuo file .env e sostituisci i valori placeholder con i tuoi dati reali (specialmente per la chiave segreta e le credenziali SMTP!).
Snippet di codice

# .env file (NON committare questo file se contiene secrets reali!)

# --- Backend Settings ---
# Genera questa chiave UNA SOLA VOLTA e conservala al sicuro!
# Puoi usare: python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'
APP_SECRET_KEY=LA_TUA_CHIAVE_SEGRETA_FERNET_QUI

LOG_LEVEL=INFO # Livello di logging per il backend (DEBUG, INFO, WARNING, ERROR)

# --- Alertmanager Email Settings (per ricevere gli alert) ---
ALERTMANAGER_EMAIL_FROM=alertmanager@tuo-dominio.com # Mittente email
SMTP_SMARTHOST=smtp.tuo-provider-email.com:587 # Host e porta del tuo server SMTP
SMTP_AUTH_USERNAME=la-tua-username-smtp # Username per autenticazione SMTP
SMTP_AUTH_IDENTITY=la-tua-username-smtp # Spesso uguale a username
SMTP_AUTH_PASSWORD=la-tua-password-smtp # Password per autenticazione SMTP
ALERTMANAGER_EMAIL_TO=destinatario.alert@tuo-dominio.com # Email dove ricevere gli alert

# --- Grafana Admin Settings (Opzionale, cambia la password!) ---
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=mettiUnaPasswordForteQui!
```


    ⚠️ Sicurezza Importante:

        La APP_SECRET_KEY è usata per la cifratura (se implementata). DEVE essere mantenuta segreta e consistente tra i riavvii. Generala una volta e conservala!
        Non mettere mai password o chiavi reali direttamente nel codice o in file committati su Git. Il file .env è un buon compromesso per lo sviluppo locale, ma non committarlo. Per produzione, usa sistemi di gestione dei secret più robusti (Docker secrets, K8s secrets, Vault, ecc.).

▶️ Avvio Rapido: Accendiamo i Motori!

Una volta configurato il file .env, avviare tutti i servizi è un gioco da ragazzi:


Dalla directory principale del progetto (HealthSolver-main)

1. Build (se è la prima volta o hai cambiato i Dockerfile) e Start dei container in background (-d)
```
docker-compose up -d --build
```
2. Per fermare i container:
```
docker-compose down
```
3. Per fermare e rimuovere i volumi (ATTENZIONE: perdi i dati persistenti!):
```
docker-compose down -v
```
🎉 Fatto! Ora i servizi dovrebbero essere attivi e accessibili:
Servizio	URL Locale	Credenziali Default (se applicabile)	Note
Frontend	http://localhost:3000	-	Interfaccia React
Backend API	http://localhost:8000	-	API FastAPI (Docs: /docs o /redoc)
Dashboard	http://localhost:8501	-	Dashboard Streamlit
Grafana	http://localhost:3001	admin / (password nel .env)	Dashboard per monitoraggio (importa .json)
Prometheus	http://localhost:9090	-	Raccolta metriche (esplora: /graph)
Alertmanager	http://localhost:9093	-	Gestione Alert
Redis Commander	http://localhost:8081 (Se aggiunto)	-	GUI per Redis (Aggiungere a docker-compose)

(Nota: La porta di Grafana è 3001 per evitare conflitti con la 3000 usata spesso dallo sviluppo frontend)
🧑‍🔬 Task Comuni: Il Lavoro dello Scienziato Pazzo (ma Organizzato)

Ecco alcuni comandi utili da eseguire dopo aver avviato i container con docker-compose up -d:

    🤖 Eseguire il Training del Modello ML:
    
```
docker-compose exec backend python backend/models/data_training.py
```
Questo comando esegue lo script di training all'interno del container backend. Monitora l'output per vedere i log di MLflow e l'esito.

🧪 Eseguire i Test (Pytest):

Opzione 1: Dentro il container (consigliato)
Installa dipendenze di sviluppo se non sono già nell'immagine Docker
```
docker-compose exec backend pip install -r requirements-dev.txt
```
Esegui i test

```
docker-compose exec backend pytest -v tests/backend/
```
Opzione 2: Localmente (richiede ambiente Python configurato)


    Installa dipendenze di sviluppo
    ```
    pip install -r requirements-dev.txt
    ```
    Esegui i test (dalla root del progetto)
    
    ```
    pytest -v
    ```

📄 Visualizzare i Log dei Servizi:


Visualizza log di tutti i servizi (seguendo l'output con -f)
```
docker-compose logs -f
```
Visualizza log solo del backend
```
docker-compose logs -f backend
```
Visualizza log solo del frontend
```
docker-compose logs -f frontend
```
🔄 Ricaricare la Configurazione di Prometheus (senza riavvio):


    Assicurati che '--web.enable-lifecycle' sia nei command di Prometheus
```    
curl -X POST http://localhost:9090/-/reload

```

🗺️ Struttura del Progetto: Una Mappa per l'Esploratore

.
├── backend/         # Codice sorgente del backend FastAPI (API, Modelli, DB, Utils)
│   ├── models/      # Logica ML, Training, Definizione DB (SQLAlchemy)
│   ├── routes/      # Definizione degli endpoint API FastAPI
│   ├── utils/       # Funzioni di utilità (logging, cache, crypto)
│   ├── Dockerfile   # Istruzioni per buildare l'immagine Docker del backend
│   └── main.py      # Entry point dell'applicazione FastAPI
├── dashboard/       # Codice sorgente del dashboard Streamlit
│   ├── Dockerfile   # Istruzioni per buildare l'immagine Docker del dashboard
│   └── dashboard.py # Script del dashboard
├── frontend/src/    # Codice sorgente del frontend React (usare questo!)
│   ├── components/  # Componenti React riutilizzabili
│   ├── Dockerfile   # Istruzioni per buildare l'immagine Docker del frontend
│   ├── App.js       # Componente principale React
│   └── index.js     # Entry point React
├── tests/           # Test automatici (unit e integration)
│   └── backend/     # Test specifici per il backend
├── deployments/     # Esempi di configurazione per deployment (es. K8s)
├── logs/            # Directory per i file di log (generata automaticamente)
├── models/          # (Potenziale) Directory per modelli ML salvati (.pkl, .pth) - dipende dalla config
├── .env             # File per le variabili d'ambiente (DA CREARE, NON COMMETTERE!)
├── .gitignore       # File e directory ignorati da Git
├── alert_rules.yml  # Regole per gli alert di Prometheus
├── alertmanager.yml # Configurazione di Alertmanager
├── docker-compose.yml # File principale per orchestrare i container Docker
├── grafana_dashboard.json # Esempio di dashboard Grafana da importare
├── prometheus.yml   # Configurazione di Prometheus (targets, scrape config)
├── README.md        # Questo fantastico file! :)
├── requirements.txt # Dipendenze Python del backend (per produzione)
└── requirements-dev.txt # Dipendenze Python aggiuntive per sviluppo/test

```

🤔 Troubleshooting & Note

    Errori docker-compose up: Controlla i log (docker-compose logs [nome_servizio]) per capire quale servizio sta fallendo. Spesso sono problemi di build (Dockerfile mancante/errato), porte già in uso, o variabili d'ambiente mancanti.
    Permessi File (Linux/MacOS): Potresti avere problemi di permessi sui volumi montati (es. logs/, mlflow_data/). Assicurati che l'utente Docker abbia i permessi di scrittura o usa tecniche di gestione UID/GID nei Dockerfile.
    Connessione Redis/DB: Assicurati che i nomi dei servizi nel docker-compose.yml (redis, backend) corrispondano agli host usati nelle configurazioni (es. REDIS_HOST: "redis" nel .env per il backend).
    Frontend non si connette al Backend: Verifica che l'URL dell'API nel codice frontend sia corretto (http://localhost:8000/...). Controlla la console del browser per errori CORS (Cross-Origin Resource Sharing). Potrebbe essere necessario configurare CORS nel backend FastAPI se frontend e backend girano su porte diverse (anche se Docker Compose dovrebbe metterli sulla stessa rete "virtuale"). Il command per Streamlit include --server.enableCORS=false come esempio.
    Alert non arrivano: Verifica la configurazione SMTP in alertmanager.yml e nel .env. Controlla i log di Alertmanager (docker-compose logs alertmanager). Assicurati che Prometheus invii alert ad Alertmanager (controlla la sezione 'Alerts' in Prometheus UI).

❤️ Contribuire & Licenza

Al momento questo è un progetto dimostrativo. Se vuoi contribuire, sentiti libero/a di aprire una Issue o una Pull Request!

(Aggiungere qui dettagli sulla licenza se applicabile, es. MIT License)

✨ Buon divertimento con HealthSolver! ✨Pull request e segnalazioni sono benvenute.
📬 Contattami su GitHub o email per collaborazioni professionali.
🧪 Licenza

Distribuito con licenza MIT.
© 2024 – Progetto HealthSolver
