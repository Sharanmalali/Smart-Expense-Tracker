import React from 'react';
import { Link } from 'react-router-dom';

import SummaryStats from '../components/charts/SummaryStats';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import IncomeDoughnutChart from '../components/charts/IncomeDoughnutChart';
import TrendLineChart from '../components/charts/TrendLineChart';

const AnalyticsPage = () => {
  return (
    <div
      style={{
        padding: '26px',
        maxWidth: '1200px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '26px'
      }}
    >
      {/* Top Navigation */}
      <div>
        <Link to="/dashboard" style={{ display: 'inline-block', marginBottom: '12px' }}>
          {"<"} Back to Dashboard
        </Link>

        <h1 style={{ textAlign: 'center', marginTop: '4px', marginBottom: '0px' }}>
          Your Expense Analytics
        </h1>
      </div>

      {/* Summary Stats (Full width row) */}
      <div>
        <SummaryStats />
      </div>

      {/* Row with 2 charts side by side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '26px'
        }}
      >
        <CategoryPieChart height={220} />
        <IncomeDoughnutChart height={220} />
      </div>

      {/* Trend Chart (Full width row) */}
      <div>
        <TrendLineChart height={260} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
