import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAnalysisByCategory } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const colorPalette = [
  '#FF86A1', '#00C2A8', '#4A90E2',
  '#9B7BFF', '#FFB86B', '#7EE6C6',
];

const CategoryPieChart = ({ height = 240 }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalysisByCategory();
        const labels = Object.keys(res.data);
        const values = Object.values(res.data);

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: labels.map((_, i) => colorPalette[i % colorPalette.length]),
              borderColor: '#0b1220',
              borderWidth: 2
            }
          ]
        });
      } catch (e) {
        console.error("Pie chart load error", e);
      }
    };
    load();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="card">
      <div className="card-title">Spending by Category</div>

      {/* FIX: fixed-height container prevents reflow + auto scroll */}
      <div style={{ height, overflow: 'hidden' }}>
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                    const pct = ((ctx.raw / total) * 100).toFixed(1);
                    return `${ctx.label}: $${ctx.raw} (${pct}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default CategoryPieChart;
