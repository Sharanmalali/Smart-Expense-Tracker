import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAnalysisIncomeVsExpense } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeDoughnutChart = ({ height = 240 }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalysisIncomeVsExpense();
        const { income, spent, saved } = res.data;

        const spentVal = Number(spent);
        const savedVal = Number(saved || Math.max(0, (income || 0) - spentVal));

        setChartData({
          labels: ['Spent', 'Saved'],
          datasets: [
            {
              data: [spentVal, savedVal],
              backgroundColor: ['#FF86A1', '#00C2A8'],
              borderColor: '#0b1220',
              borderWidth: 2
            }
          ]
        });
      } catch (e) {
        console.error("Doughnut chart load error", e);
      }
    };

    load();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="card">
      <div className="card-title">Income vs. Spent</div>

      {/* FIX: fixed height container */}
      <div style={{ height, overflow: 'hidden' }}>
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            cutout: '60%',
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

export default IncomeDoughnutChart;
