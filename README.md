# HealthSolver

HealthSolver is a cutting-edge **Medical Decision Support System** powered by **Machine Learning**. Designed for healthcare professionals, it provides intelligent recommendations for therapies and analyzes the risks of side effects, helping to streamline clinical decision-making and improve patient outcomes.

---

## **Features**
- **Personalized Therapy Recommendations**  
  Suggests the most suitable therapy based on patient data, such as age, BMI, and condition severity.
  
- **Risk Analysis**  
  Calculates the probability of side effects for proposed therapies using advanced predictive models.

- **Secure and Reliable**  
  Protects sensitive patient data with **OAuth2** authentication and robust encryption.

- **Monitoring and Analytics**  
  Tracks API performance metrics with **Prometheus** and visualizes them using **Grafana**.

---

## **Technologies**
HealthSolver integrates modern tools and frameworks to deliver a seamless experience:
- **Frontend**: React  
  Provides an intuitive interface for data input and result visualization.
- **Backend**: FastAPI  
  Ensures fast and reliable processing of patient data.
- **Database**: PostgreSQL  
  Manages patient records and therapy results securely.
- **Machine Learning**: Scikit-Learn  
  Utilizes predictive models for recommendations and risk analysis.
- **Monitoring**: Prometheus and Grafana  
  Offers real-time insights into system performance.
- **Security**: OAuth2 and Cryptography  
  Safeguards data with state-of-the-art security mechanisms.

---

## **How It Works**
1. **Input Patient Data**  
   The user enters patient details via a user-friendly web interface.
2. **Model Processing**  
   The backend processes the data using trained Machine Learning models.
3. **Results Generation**  
   Therapy recommendations and risk scores are returned to the user.
4. **Monitoring and Logging**  
   All requests are logged, and system performance is tracked in real time.

---

## **Setup and Installation**

### Prerequisites
- **Docker** and **Docker Compose**
- Python 3.9+ (for local development)
- PostgreSQL database

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/HealthSolver.git
   cd HealthSolver

    Build and start the services:

    docker-compose up --build

    Access the services:
        Backend API: http://localhost:8000
        Prometheus Dashboard: http://localhost:9090
        Grafana Dashboard: http://localhost:3000

API Endpoints
/recommendation/

    Method: POST
    Input:

{
  "age": 30,
  "bmi": 25,
  "condition_severity": 2
}

Output:

    {
      "recommendation": "Therapy A"
    }

/risk_analysis/

    Method: POST
    Input:

{
  "age": 30,
  "therapy_type": "standard",
  "comorbidities_count": 2
}

Output:

    {
      "risk_score": 0.25
    }

Frontend Overview

The React frontend includes:

    PatientForm Component: Captures patient information.
    Results Component: Displays recommendations and risk scores.
    ResultsChart Component: Visualizes trends in risk scores.

To run the frontend locally:

cd frontend
npm install
npm start

Monitoring

    Prometheus collects metrics on API performance (e.g., request count, response times).
    Grafana visualizes these metrics through custom dashboards.

Security

    OAuth2 Authentication ensures only authorized users can access APIs.
    Cryptography protects sensitive patient data during processing and storage.

Contributing

Contributions are welcome! To contribute:

    Fork the repository.
    Create a new branch for your feature/bugfix.
    Submit a pull request with a detailed description of your changes.

License

This project is licensed under the MIT License. See the LICENSE file for details.
Contact

For questions or support, please contact:
Riccardo Scaringi - ricscar@gmail.com
