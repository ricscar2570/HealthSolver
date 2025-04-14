// frontend/src/components/PatientForm.js
import React, { useState } from 'react';

const PatientForm = () => {
  // Aggiungi campi necessari per il modello (es. comorbidities_count)
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    condition_severity: '',
    comorbidities_count: '' // Aggiunto campo
  });
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendation(null);

    // Converti i valori numerici
    const payload = {
        age: parseInt(formData.age, 10),
        bmi: parseFloat(formData.bmi),
        condition_severity: parseInt(formData.condition_severity, 10),
        comorbidities_count: parseInt(formData.comorbidities_count, 10)
    };

    // Verifica se i valori sono numeri validi
     if (Object.values(payload).some(isNaN)) {
        setError("Please enter valid numbers for all fields.");
        setLoading(false);
        return;
    }


    try {
      // Chiama l'endpoint corretto registrato in backend/main.py
      // Assumendo che predict_router sia stato incluso con prefix="/predict"
      const response = await fetch('http://localhost:8000/predict/predict', { // URL aggiornato
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Invia il payload convertito
      });

      if (!response.ok) {
        // Gestisci errori HTTP
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Assumi che la risposta sia tipo {"recommended_therapy": X}
      setRecommendation(`Recommended Therapy: ${result.recommended_therapy}`);

    } catch (error) {
      console.error('Error submitting form:', error);
      setError(`Error submitting form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h2>Patient Form for Therapy Recommendation</h2>
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      </label>
      <br />
      <label>
        BMI:
        <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Condition Severity:
        <input type="number" name="condition_severity" value={formData.condition_severity} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Comorbidities Count: {/* Aggiunto campo nel form */}
        <input type="number" name="comorbidities_count" value={formData.comorbidities_count} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Get Recommendation'}
      </button>
      {recommendation && <p style={{ color: 'green', marginTop: '10px' }}>{recommendation}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </form>
  );
};

export default PatientForm;
