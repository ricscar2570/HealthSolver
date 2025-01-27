import React from 'react';
import { Bar } from 'react-chartjs-2';

/**
 * ResultChart Component
 * Displays data as a bar chart. Accepts `data` and `title` as props.
 */
const ResultChart = ({ data, title }) => {
  if (!data || !data.labels || !data.datasets) {
    return <p>No data available to display the chart.</p>;
  }

  return (
    <div style={{ margin: '20px auto', width: '80%' }}>
      <h2>{title || 'Results Chart'}</h2>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Therapies / Metrics',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Values / Risk Scores',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ResultChart;
