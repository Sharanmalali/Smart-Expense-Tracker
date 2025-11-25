import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { getAnalysisMonthlyTrend } from '../../services/api';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
);

const TrendLineChart = ({ height = 260 }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalysisMonthlyTrend();
        const labels = Object.keys(res.data);
        const values = Object.values(res.data);

        setChartData({
          labels,
          datasets: [
            {
              label: "Monthly Spending",
              data: values,
              borderColor: '#00C2A8',
              backgroundColor: (ctx) => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                g.addColorStop(0, 'rgba(0,194,168,0.25)');
                g.addColorStop(1, 'rgba(0,194,168,0.02)');
                return g;
              },
              fill: true,
              tension: 0.25,
              pointRadius: 4
            }
          ]
        });
      } catch (e) {
        console.error("Trend chart load error", e);
      }
    };

    load();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="card">
      <div className="card-title" style={{ textAlign: 'center' }}>
        Monthly Expense Trend
      </div>

      {/* FIX: fixed-height prevents reflow loop */}
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
              x: { grid: { display: false } },
              y: { grid: { color: 'rgba(255,255,255,0.05)' } }
            }
          }}
        />
      </div>
    </div>
  );
};

export default TrendLineChart;
