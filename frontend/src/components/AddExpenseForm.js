import React, { useState } from 'react';
import { addExpense } from '../services/api';

const AddExpenseForm = ({ onExpenseAdded }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('amount', parseFloat(amount));
      formData.append('date', date);
      formData.append('description', description);
      if (file) formData.append('file', file);

      await addExpense(formData);

      // Reset fields
      setCategory('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setFile(null);

      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      console.error(err);
      setError('Failed to add expense. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ gap: 12 }}>
      <div className="card-title">Add New Expense</div>

      {error && <div className="error-message">{error}</div>}

      <div className="input-with-icon">
        <span className="icon">🗂</span>
        <input
          placeholder="Category (e.g., Food)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="input-with-icon">
        <span className="icon">💰</span>
        <input
          type="number"
          step="0.01"
          placeholder="Amount (e.g., 12.99)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }} className="input-with-icon">
          <span className="icon">📅</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div style={{ flex: 1 }} className="input-with-icon">
          <span className="icon">📝</span>
          <input
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label
          style={{ display: 'inline-flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}
          className="btn btn-outline"
        >
          📎 <span>{file ? file.name : 'Attach receipt (optional)'}</span>
          <input
            style={{ display: 'none' }}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {saving ? 'Adding…' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
