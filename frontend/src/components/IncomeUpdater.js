import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserIncome } from '../services/api';

const IncomeUpdater = () => {
  const { user, setUser } = useAuth();
  const [income, setIncome] = useState(user?.monthly_income || 0);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserIncome(parseFloat(income));
      setUser(response.data);
      setMessage('Income updated successfully!');
      setTimeout(() => setMessage(''), 3000); // Hide message after 3s
    } catch (error) {
      console.error('Failed to update income', error);
      setMessage('Failed to update income.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="card">
      <h3>Monthly Income</h3>
      <p>Current: ${user?.monthly_income ? user.monthly_income.toFixed(2) : '0.00'}</p>
      <form onSubmit={handleUpdate}>
        <input
          type="number"
          step="0.01"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Set new income"
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default IncomeUpdater;