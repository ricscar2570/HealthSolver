// frontend/src/components/Results.js
import React from 'react';
import ResultChart from './ResultChart'; // Assicurati che l'import sia corretto

const Results = () => {
  // Definisci l'endpoint API da cui caricare i dati per il grafico
  // Esempio: usa l'endpoint di previsione temporale da analytics.py (se attivato)
  const predictionApiEndpoint = 'http://localhost:8000/dashboard/predict'; // URL aggiornato

  // Esempio: usa un altro endpoint se vuoi visualizzare altro, ad esempio
  // una distribuzione di rischio o dati paziente da /dashboard/data
  // const patientDataApiEndpoint = 'http://localhost:8000/dashboard/data';

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h2>Results and Analysis</h2>

      {/* Grafico per le previsioni temporali */}
      <ResultChart
        apiEndpoint={predictionApiEndpoint}
        title="Condition Severity Prediction (Next 30 Days)"
        defaultChartType="line" // La previsione temporale si adatta bene a un grafico a linea
        dataTransformer={(apiData) => {
           // Trasforma i dati da [{ds: 'YYYY-MM-DD', yhat: value}, ...]
           // al formato richiesto da Chart.js ({ labels: [], datasets: [{ data: [] }] })
           if (!apiData || !Array.isArray(apiData)) return null;
           return {
             labels: apiData.map(item => new Date(item.ds).toLocaleDateString()), // Formatta le date
             datasets: [
               {
                 label: 'Predicted Severity (yhat)',
                 data: apiData.map(item => item.yhat),
                 borderColor: 'rgb(75, 192, 192)',
                 tension: 0.1
               }
             ]
           };
        }}
      />

      {/* Aggiungi altri grafici se necessario, ad esempio per i dati dei pazienti */}
      {/*
      <ResultChart
        apiEndpoint={patientDataApiEndpoint}
        title="Patient Condition Severity Distribution"
        defaultChartType="bar"
        dataTransformer={(apiData) => {
          // Trasforma i dati da [{age: X, bmi: Y, condition_severity: Z}, ...]
          // Esempio: conta le occorrenze per severity
          if (!apiData || !Array.isArray(apiData)) return null;
          const severityCounts = apiData.reduce((acc, patient) => {
            const severity = patient.condition_severity;
            acc[severity] = (acc[severity] || 0) + 1;
            return acc;
          }, {});
          return {
            labels: Object.keys(severityCounts).sort(),
            datasets: [
              {
                label: 'Number of Patients',
                data: Object.values(severityCounts),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
              }
            ]
          };
        }}
      />
      */}

    </div>
  );
};

export default Results;
