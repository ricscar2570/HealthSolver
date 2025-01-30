import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const ResultChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/dashboard/predict")
      .then((res) => res.json())
      .then((data) => {
        setChartData({
          labels: data.map((item) => item.ds),
          datasets: [
            {
              label: "Predicted Severity",
              data: data.map((item) => item.yhat),
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
            },
          ],
        });
      });
  }, []);

  return (
    <div>
      <h2>Prediction Chart</h2>
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default ResultChart;
