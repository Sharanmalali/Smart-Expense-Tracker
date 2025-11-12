import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAnalysisByCategory } from '../../services/api';

// Register the components we need for a Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalysisByCategory();
        const data = response.data;
        
        const labels = Object.keys(data);
        const values = Object.values(data);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Amount Spent',
              data: values,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };
    fetchData();
  }, []);

  if (!chartData) return <p>Loading category chart...</p>;

  return (
    <div style={{ height: '300px', width: '300px' }}>
      <h3>Spending by Category</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default CategoryPieChart;