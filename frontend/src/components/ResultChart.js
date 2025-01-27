import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

/**
 * ResultChart Component
 * This component displays different types of charts (Bar, Line, Pie) based on user selection.
 * It supports real-time updates from a backend API.
 */
const ResultChart = ({ apiEndpoint, defaultChartType = 'bar', title = 'Results Chart' }) => {
  const [chartType, setChartType] = useState(defaultChartType); // Current chart type
  const [chartData, setChartData] = useState(null); // Chart data fetched from backend
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        setChartData({
          labels: data.labels,
          datasets: data.datasets,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Could not load chart data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  // Function to render the selected chart type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      default:
        return <Bar data={chartData} />;
    }
  };

  return (
    <div style={{ margin: '20px auto', width: '80%' }}>
      <h2>{title}</h2>
      
      {/* Loading and error messages */}
      {loading && <p>Loading chart data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Chart and controls */}
      {!loading && chartData && (
        <>
          {/* Chart rendering */}
          {renderChart()}

          {/* Chart type selector */}
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="chartType" style={{ marginRight: '10px' }}>
              Select Chart Type:
            </label>
            <select
              id="chartType"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
        </>
      )}

      {/* No data available */}
      {!loading && !chartData && <p>No data available for the chart.</p>}
    </div>
  );
};

export default ResultChart;
