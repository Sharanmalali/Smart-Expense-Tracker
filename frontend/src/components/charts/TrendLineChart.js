import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAnalysisMonthlyTrend } from '../../services/api';

// Register components for a Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendLineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalysisMonthlyTrend();
        const data = response.data;
        
        const labels = Object.keys(data); // e.g., ["2025-10", "2025-11"]
        const values = Object.values(data);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Spent per Month',
              data: values,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch trend data:", error);
      }
    };
    fetchData();
  }, []);

  if (!chartData) return <p>Loading trend chart...</p>;

  return (
    <div style={{ height: '300px', width: '600px' }}>
      <h3>Monthly Expense Trend</h3>
      <Line data={chartData} />
    </div>
  );
};

export default TrendLineChart;