import React, { useState } from 'react';
import ResultChart from './ResultChart';

const Results = () => {
  // Sample data for the chart
  const [chartData] = useState({
    labels: ['Therapy A', 'Therapy B', 'Therapy C'],
    datasets: [
      {
        label: 'Risk Score',
        data: [0.3, 0.5, 0.8],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  return (
    <div>
      <h2>Results and Risk Analysis</h2>
      {/* Integrating ResultChart with sample data */}
      <ResultChart data={chartData} title="Therapy Risk Comparison" />
    </div>
  );
};

export default Results;
