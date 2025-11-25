import React, { useState } from 'react';
import ReceiptModal from './ReceiptModal';
import { deleteExpense as apiDelete } from '../services/api';

const API_URL = 'http://127.0.0.1:8000';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  const [openReceipt, setOpenReceipt] = useState(null);
  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await apiDelete(id);
        if (onDeleteExpense) onDeleteExpense();
      } catch (e) {
        console.error(e);
        alert('Delete failed.');
      }
    }
  };

  return (
    <div>
      <h3 className="card-title">Your Expenses</h3>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th><th>Category</th><th>Amount</th><th>Description</th><th>Receipt</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: 28 }}>
                <div className="empty-state">
                  <div style={{ fontSize: 40 }}>🧾</div>
                  <div style={{ fontWeight: 700 }}>No expenses yet</div>
                  <div className="small-muted">Add your first expense using the form.</div>
                </div>
              </td>
            </tr>
          ) : (
            expenses.map((exp) => (
              <tr key={exp.id} className="expense-row">
                <td>{exp.date}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 4, background: categoryColor(exp.category) }} />
                    <span>{exp.category}</span>
                  </div>
                </td>
                <td>${Number(exp.amount).toFixed(2)}</td>
                <td>{exp.description}</td>
                <td>
                  {exp.image_path ? (
                    <>
                      <img
                        src={`${API_URL}${exp.image_path}`}
                        alt="receipt thumb"
                        className="receipt-thumb"
                        onClick={() => setOpenReceipt(`${API_URL}${exp.image_path}`)}
                        style={{ cursor: 'pointer' }}
                        title="Click to preview"
                      />
                    </>
                  ) : 'N/A'}
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => setOpenReceipt(exp.image_path ? `${API_URL}${exp.image_path}` : null)}>
                    👁️
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="btn btn-outline" style={{ marginLeft: 8 }}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {openReceipt && (
        <ReceiptModal imageUrl={openReceipt} onClose={() => setOpenReceipt(null)} />
      )}
    </div>
  );
};

function categoryColor(category) {
  // simple deterministic mapping
  const map = {
    food: '#FFB86B',
    rent: '#4A90E2',
    travel: '#9B7BFF',
    bills: '#00C2A8',
    entertainment: '#FF6B9A',
  };
  return map[category?.toLowerCase()] || '#7c8897';
}

export default ExpenseList;
