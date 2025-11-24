import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../App.css'; 
import '../components/AuthForms.css'; // Assuming this handles specific form styling

const LoginPage = () => {
  return (
    // Updated class name for dark mode container consistency
    <div className="auth-container dark-theme"> 
      <div className="auth-form-wrapper">
        <h1 className="logo-title">Expense Tracker</h1>
        <p className="subtitle">Welcome back. Please log in to your account.</p>
        <LoginForm />
        <p className="auth-link">
          Don't have an account? <Link to="/register" className="link-text">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;