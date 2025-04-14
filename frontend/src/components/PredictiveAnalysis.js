// frontend/src/components/PredictiveAnalysis.js
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Manteniamo il grafico se vogliamo visualizzare l'input o un risultato fittizio

// Assicurati che Chart.js sia registrato (potrebbe essere già fatto in ResultChart.js o qui)
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );


const PredictiveAnalysis = () => {
  // Stessi campi richiesti dal modello come in PatientForm
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    condition_severity: '',
    comorbidities_count: ''
  });
  const [analysisResult, setAnalysisResult] = useState(null); // Per mostrare il risultato
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    // Converti e valida i dati come in PatientForm
    const payload = {
        age: parseInt(formData.age, 10),
        bmi: parseFloat(formData.bmi),
        condition_severity: parseInt(formData.condition_severity, 10),
        comorbidities_count: parseInt(formData.comorbidities_count, 10)
    };

    if (Object.values(payload).some(isNaN)) {
        setError("Please enter valid numbers for all fields.");
        setLoading(false);
        return;
    }

    try {
      // Chiama lo stesso endpoint di PatientForm
      const response = await fetch('http://localhost:8000/predict/predict', { // URL aggiornato
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Mostra il risultato della predizione
      setAnalysisResult(`Recommended Therapy based on Analysis: ${result.recommended_therapy}`);

    } catch (error) {
      console.error('Error fetching analysis:', error);
      setError(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Il grafico a barre qui non ha molto senso con una singola raccomandazione.
  // Potremmo rimuoverlo o usarlo per visualizzare i dati di input (formData).
  // Esempio: Visualizzare i valori inseriti
  const inputChartData = {
      labels: ['Age', 'BMI', 'Severity', 'Comorbidities'],
      datasets: [
          {
              label: 'Patient Input Values',
              data: [
                  formData.age || 0,
                  formData.bmi || 0,
                  formData.condition_severity || 0,
                  formData.comorbidities_count || 0
              ],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
              ],
          }
      ]
  };
  const chartOptions = {
      responsive: true,
      plugins: {
          legend: { display: false },
          title: { display: true, text: 'Patient Input Data' }
      },
      scales: { y: { beginAtZero: true } }
  };


  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h2>Predictive Analysis (Therapy Recommendation)</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ marginRight: '10px' }}>
          Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </label>
        <label style={{ marginRight: '10px' }}>
          BMI:
          <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} required />
        </label>
        <label style={{ marginRight: '10px' }}>
          Severity:
          <input type="number" name="condition_severity" value={formData.condition_severity} onChange={handleChange} required />
        </label>
        <label>
          Comorbidities:
          <input type="number" name="comorbidities_count" value={formData.comorbidities_count} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={loading} style={{ marginLeft: '15px' }}>
          {loading ? 'Analyzing...' : 'Analyze for Recommendation'}
        </button>
      </form>

      {analysisResult && <p style={{ color: 'blue', marginTop: '10px' }}>{analysisResult}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Mostra il grafico con i dati di input */}
      <div style={{ marginTop: '20px', maxWidth: '500px' }}>
         <Bar data={inputChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PredictiveAnalysis;
