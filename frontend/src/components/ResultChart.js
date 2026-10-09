// frontend/src/components/ResultChart.js
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const identityDataTransformer = (data) => data;

const ResultChart = ({
  apiEndpoint,
  defaultChartType = 'bar',
  title = 'Results Chart',
  dataTransformer = identityDataTransformer
}) => {
  const [chartType, setChartType] = useState(defaultChartType);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(Boolean(apiEndpoint));
  const [error, setError] = useState(null);
  const chartTypeId = `chartType-${String(title).replace(/[^A-Za-z0-9_-]+/g, '-')}`;

  useEffect(() => {
    if (!apiEndpoint) {
      setChartData(null);
      setError('API endpoint is not defined.');
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null);

      try {
        const response = await fetch(apiEndpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch chart data (${response.status})`);
        }

        const rawData = await response.json();
        const transformedData = dataTransformer(rawData);

        if (
          !transformedData ||
          !Array.isArray(transformedData.labels) ||
          !Array.isArray(transformedData.datasets)
        ) {
          throw new Error('Invalid data format received after transformation.');
        }

        if (!controller.signal.aborted) {
          setChartData(transformedData);
        }
      } catch (err) {
        if (err?.name === 'AbortError') {
          return;
        }
        console.error('Error fetching or processing chart data:', err);
        if (!controller.signal.aborted) {
          setError(`Could not load chart data: ${err.message}`);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [apiEndpoint, dataTransformer]);

  const renderChart = () => {
    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: title }
      }
    };

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return (
          <Pie
            data={chartData}
            options={{
              ...options,
              plugins: { ...options.plugins, legend: { position: 'right' } }
            }}
          />
        );
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px dashed #eee' }}>
      {loading && <p>Loading chart data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && chartData && (
        <>
          {renderChart()}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <label htmlFor={chartTypeId} style={{ marginRight: '10px' }}>
              Chart Type:
            </label>
            <select
              id={chartTypeId}
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>
        </>
      )}

      {!loading && !error && !chartData && <p>No data available for the chart.</p>}
    </div>
  );
};

export default ResultChart;
