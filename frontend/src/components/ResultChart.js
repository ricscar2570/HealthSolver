// frontend/src/components/ResultChart.js
// Modifica per accettare un dataTransformer opzionale
import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Registra i componenti necessari di Chart.js
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

/**
 * ResultChart Component
 * Visualizza grafici (Bar, Line, Pie) da un endpoint API,
 * con trasformazione dati opzionale.
 */
const ResultChart = ({
  apiEndpoint,
  defaultChartType = 'bar',
  title = 'Results Chart',
  dataTransformer = (data) => data // Funzione identità di default
}) => {
  const [chartType, setChartType] = useState(defaultChartType);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiEndpoint) {
        setError("API endpoint is not defined.");
        setLoading(false);
        return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null);
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch chart data (${response.status})`);
        }
        const rawData = await response.json();

        // Applica la trasformazione ai dati ricevuti
        const transformedData = dataTransformer(rawData);

        if (!transformedData || !transformedData.labels || !transformedData.datasets) {
             console.error("Transformed data is not in the expected Chart.js format:", transformedData);
             throw new Error("Invalid data format received after transformation.");
        }

        setChartData(transformedData); // Usa i dati trasformati

      } catch (err) {
        console.error('Error fetching or processing chart data:', err);
        setError(`Could not load chart data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, dataTransformer]); // Aggiungi dataTransformer alle dipendenze

  // Funzione per renderizzare il grafico selezionato
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
        // Pie chart options might differ
        return <Pie data={chartData} options={{ ...options, plugins: { ...options.plugins, legend: { position: 'right' }}}} />;
      default: // bar
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px dashed #eee' }}>
      {/* Titolo spostato nelle opzioni del grafico */}
      {/* <h4>{title}</h4> */}

      {loading && <p>Loading chart data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && chartData && (
        <>
          {renderChart()}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <label htmlFor={`chartType-${title}`} style={{ marginRight: '10px' }}>
              Chart Type:
            </label>
            <select
              id={`chartType-${title}`} // Usa ID univoco se ci sono più grafici
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
