import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import '../App.css'; // Import App.css
import '../components/AuthForms.css'; // Import the new form CSS

const RegisterPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1>Register for Expense Tracker</h1>
        <RegisterForm />
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;