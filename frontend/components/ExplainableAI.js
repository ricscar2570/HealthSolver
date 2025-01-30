import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

const ExplainableAI = () => {
  const [shapData, setShapData] = useState(null);
  const [patientData, setPatientData] = useState({ age: 50, bmi: 25, condition_severity: 2, comorbidities_count: 1 });

  const fetchSHAP = async () => {
    const response = await fetch("http://localhost:8000/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });

    if (response.ok) {
      const data = await response.json();
      setShapData({
        labels: data.features,
        datasets: [
          {
            label: "SHAP Value",
            data: data.values,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    }
  };

  return (
    <div>
      <h2>Explainable AI - SHAP Analysis</h2>
      <button onClick={fetchSHAP}>Analyze Decision</button>
      {shapData && <Bar data={shapData} />}
    </div>
  );
};

export default ExplainableAI;
