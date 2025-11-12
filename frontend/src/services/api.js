import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://smart-expense-tracker-rgbr.onrender.com', // Your FastAPI backend URL
});

// --- Axios Interceptor ---
// This code will run on EVERY request.
// It checks if we have a token in localStorage and adds it to the header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const registerUser = (username, email, password) => {
  return api.post('/auth/register', { username, email, password });
};

// Note: FastAPI's OAuth2PasswordRequestForm expects form data
export const loginUser = (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  return api.post('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

// --- User Endpoints ---
export const getCurrentUser = () => {
  return api.get('/users/me');
};

export default api;

// ... (keep all the existing code for api, interceptors, auth, and user)

// --- Expense Endpoints ---
export const getExpenses = () => {
  return api.get('/expenses');
};

// formData will be an instance of FormData
export const addExpense = (formData) => {
  return api.post('/expenses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  });
};

export const deleteExpense = (expenseId) => {
  return api.delete(`/expenses/${expenseId}`);
};

// --- Income Endpoint ---
export const updateUserIncome = (income) => {
  return api.put('/users/me/income', { monthly_income: income });
};

// (keep the 'export default api' at the bottom)
// ... (keep all existing code)

// --- Analysis Endpoints ---
export const getAnalysisSummary = () => {
  return api.get('/analysis/summary');
};

export const getAnalysisByCategory = () => {
  return api.get('/analysis/by-category');
};

export const getAnalysisIncomeVsExpense = () => {
  return api.get('/analysis/income-vs-expense');
};

export const getAnalysisMonthlyTrend = () => {
  return api.get('/analysis/monthly-trend');
};