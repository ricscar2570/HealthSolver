// frontend/src/components/Results.js
import React from 'react';

import { apiUrl } from '../apiBase';
import ResultChart from './ResultChart';

const transformPredictionData = (apiData) => {
  if (!Array.isArray(apiData)) {
    return null;
  }

  return {
    labels: apiData.map((item) => new Date(item.ds).toLocaleDateString()),
    datasets: [
      {
        label: 'Predicted Severity (yhat)',
        data: apiData.map((item) => item.yhat),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
};

const Results = () => {
  const predictionApiEndpoint = apiUrl('/dashboard/predict');

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h2>Results and Analysis</h2>
      <ResultChart
        apiEndpoint={predictionApiEndpoint}
        title="Condition Severity Prediction (Next 30 Days)"
        defaultChartType="line"
        dataTransformer={transformPredictionData}
      />
    </div>
  );
};

export default Results;
