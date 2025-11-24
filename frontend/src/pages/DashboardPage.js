import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../services/api';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';
import IncomeUpdater from '../components/IncomeUpdater';
import './DashboardPage.css'; 

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
  }, []); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        fetchExpenses(); 
      } catch (err) {
        setError('Failed to delete expense.');
        console.error(err);
      }
    }
  };

  // The main wrapper uses the global dark theme class
  return (
    <div className="dashboard-container dark-theme">
      <div className="dashboard-content-wrapper"> {/* New wrapper for padding/centering */}
        <header className="dashboard-header">
          <h2 className="welcome-message">Welcome, {user && user.username}!</h2>
          <div className="nav-links">
            {/* Added a modern button style for consistency */}
            <Link to="/analytics" className="btn btn-secondary">View Analytics</Link>
            <button onClick={handleLogout} className="btn btn-primary-danger">Logout</button>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Left Column (Inputs) */}
          <div className="input-column">
            {/* IncomeUpdater and AddExpenseForm will inherently use .card styling */}
            <IncomeUpdater /> 
            <AddExpenseForm onExpenseAdded={fetchExpenses} />
          </div>
          
          {/* Right Column (Expense List) */}
          <div className="card expense-list-card">
            <h3 className="card-title">Recent Transactions</h3>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
              <p className="loading-message">Loading expenses...</p>
            ) : (
              <ExpenseList expenses={expenses} onDeleteExpense={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;