import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { getDailyTrend } from '../../services/api';   // <-- NEW API

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
);

const TrendLineChart = ({ month, height = 260 }) => {
  const [chartData, setChartData] = useState(null);

  // Default month = current month YYYY-MM
  const selectedMonth = month || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDailyTrend(selectedMonth);

        const labels = Object.keys(res.data).map(date => date.split("-")[2]); 
        const values = Object.values(res.data);

        setChartData({
          labels,
          datasets: [
            {
              label: "Daily Spending",
              data: values,
              borderColor: '#00F6D2',
              backgroundColor: (ctx) => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                g.addColorStop(0, 'rgba(0,246,210,0.25)');
                g.addColorStop(1, 'rgba(0,246,210,0.02)');
                return g;
              },
              fill: true,
              tension: 0.25,
              pointRadius: 3,
              pointBackgroundColor: '#00F6D2'
            }
          ]
        });
      } catch (e) {
        console.error("Daily trend load error", e);
      }
    };

    load();
  }, [selectedMonth]);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="card">
      <div className="card-title" style={{ textAlign: 'center' }}>
        Daily Expense Trend ({selectedMonth})
      </div>

      <div style={{ height, overflow: "hidden" }}>
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { mode: 'index', intersect: false }
            },
            scales: {
              x: {
                title: { display: true, text: "Day of Month" },
                grid: { display: false }
              },
              y: {
                title: { display: true, text: "Amount Spent" },
                grid: { color: 'rgba(255,255,255,0.05)' }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default TrendLineChart;
