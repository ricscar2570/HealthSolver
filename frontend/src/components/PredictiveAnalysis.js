import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';

const PredictiveAnalysis = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({ age: '', bmi: '', condition_severity: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/predictive_analysis/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  const chartData = data
    ? {
        labels: data.therapies,
        datasets: [
          {
            label: 'Risk Scores',
            data: Object.values(data.predictions),
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          },
        ],
      }
    : null;

  return (
    <div>
      <h2>Predictive Analysis</h2>
      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input type="number" name="age" onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
        <label>BMI:</label>
        <input type="number" name="bmi" onChange={(e) => setFormData({ ...formData, bmi: e.target.value })} />
        <button type="submit">Analyze</button>
      </form>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default PredictiveAnalysis;
