// ... (imports)

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  const API_URL = 'http://127.0.0.1:8000';

  return (
    <div>
      <h3>Your Expenses</h3>
      <table className="expense-table"> {/* Use the table class */}
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Receipt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No expenses found.</td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>{expense.description}</td>
                <td>
                  {expense.image_path ? (
                    <a href={`${API_URL}${expense.image_path}`} target="_blank" rel="noopener noreferrer" className="receipt-link">
                      View
                    </a>
                  ) : ( 'N/A' )}
                </td>
                <td>
                  <button onClick={() => onDeleteExpense(expense.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;