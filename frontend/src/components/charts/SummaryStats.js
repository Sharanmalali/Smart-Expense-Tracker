import React, { useState, useEffect } from 'react';
import { getAnalysisSummary } from '../../services/api';

const SummaryStats = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getAnalysisSummary();
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p>Loading summary...</p>;
  if (!summary) return <p>No summary data.</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      <div style={statBoxStyle}>
        <h4>Total Spent</h4>
        <p>${summary.total_expenses.toFixed(2)}</p>
      </div>
      <div style={statBoxStyle}>
        <h4>Average Expense</h4>
        <p>${summary.average_expense.toFixed(2)}</p>
      </div>
      <div style={statBoxStyle}>
        <h4>Total Expenses</h4>
        <p>{summary.expense_count}</p>
      </div>
    </div>
  );
};

// Simple styling for the boxes
const statBoxStyle = {
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#f4f4f4',
  textAlign: 'center',
  minWidth: '150px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export default SummaryStats;