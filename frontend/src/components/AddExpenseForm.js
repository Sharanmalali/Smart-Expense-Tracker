import React, { useState } from 'react';
import { addExpense } from '../services/api';

const AddExpenseForm = ({ onExpenseAdded }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('category', category);
    formData.append('amount', parseFloat(amount));
    formData.append('date', date);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    try {
      await addExpense(formData);
      // Reset form
      setCategory('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setFile(null);
      setError('');
      
      if (onExpenseAdded) {
        onExpenseAdded();
      }

    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Add New Expense</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Amount ($):</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Receipt (Optional):</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;