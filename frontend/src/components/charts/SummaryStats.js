import React, { useState, useEffect } from 'react';
import { getAnalysisSummary } from '../../services/api';

const StatBox = ({ icon, title, value }) => (
  <div style={{
    minWidth: 170, display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: 18, borderRadius: 12, background: 'rgba(255,255,255,0.02)', boxShadow: 'var(--shadow-soft)'
  }}>
    <div style={{ fontSize: 22 }}>{icon}</div>
    <div style={{ marginTop: 8, fontWeight:700 }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 20 }}>{value}</div>
  </div>
);

const SummaryStats = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAnalysisSummary();
        setSummary(res.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <p>Loading summary...</p>;
  if (!summary) return <p>No summary data.</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', gap: 18, marginTop: 8 }}>
      <StatBox icon="💸" title="Total Spent" value={`$${Number(summary.total_expenses).toFixed(2)}`} />
      <StatBox icon="📈" title="Average Expense" value={`$${Number(summary.average_expense).toFixed(2)}`} />
      <StatBox icon="🧾" title="Total Expenses" value={summary.expense_count} />
    </div>
  );
};

export default SummaryStats;
