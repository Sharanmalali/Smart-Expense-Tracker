import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../App.css'; // Import App.css
import '../components/AuthForms.css'; // Import the new form CSS

const LoginPage = () => {
  return (
    // Use the class from App.css
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1>Expense Tracker</h1>
        <LoginForm />
        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;