import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAnalysisIncomeVsExpense } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeDoughnutChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalysisIncomeVsExpense();
        const { income, spent, saved } = response.data;

        setChartData({
          labels: ['Spent', 'Saved'],
          datasets: [
            {
              data: [spent.toFixed(2), saved > 0 ? saved.toFixed(2) : 0],
              backgroundColor: ['#FF6384', '#36A2EB'],
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch income data:", error);
      }
    };
    fetchData();
  }, []);

  if (!chartData) return <p>Loading income chart...</p>;

  return (
    <div style={{ height: '300px', width: '300px' }}>
      <h3>Income vs. Spent</h3>
      <Doughnut data={chartData} />
    </div>
  );
};

export default IncomeDoughnutChart;