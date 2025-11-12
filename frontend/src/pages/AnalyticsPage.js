import React from 'react';
import { Link } from 'react-router-dom';
import SummaryStats from '../components/charts/SummaryStats';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import IncomeDoughnutChart from '../components/charts/IncomeDoughnutChart';
import TrendLineChart from '../components/charts/TrendLineChart';

const AnalyticsPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Link to="/dashboard">{"<"} Back to Dashboard</Link>
      
      <h1 style={{ textAlign: 'center' }}>Your Expense Analytics</h1>
      
      <SummaryStats />

      <hr style={{ margin: '30px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <CategoryPieChart />
        <IncomeDoughnutChart />
      </div>

      <hr style={{ margin: '30px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TrendLineChart />
      </div>

    </div>
  );
};

export default AnalyticsPage;