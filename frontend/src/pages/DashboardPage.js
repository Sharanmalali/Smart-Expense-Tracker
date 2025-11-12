import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../services/api';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';
import IncomeUpdater from '../components/IncomeUpdater';
import './DashboardPage.css'; // Import the new dashboard CSS

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses();
      const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedExpenses);
      setError('');
    } catch (err) {
      setError('Failed to fetch expenses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []); // The empty array [] means this runs only once on mount

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        fetchExpenses(); S      } catch (err) {
        setError('Failed to delete expense.');
        console.error(err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user && user.username}!</h2>
        <div className="nav-links">
          <Link to="/analytics">View Analytics</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div>
          <IncomeUpdater />
          <AddExpenseForm onExpenseAdded={fetchExpenses} />
        </div>
        
        {/* Right Column */}
        <div className="card">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading ? (
            <p>Loading expenses...</p>
          ) : (
            <ExpenseList expenses={expenses} onDeleteExpense={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;