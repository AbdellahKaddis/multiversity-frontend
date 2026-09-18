// src/Login/LoginForm.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./login.module.css";

const LoginForm = ({ onSubmit, onForgotPassword, loading, error }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const isValid = credentials.email &&
                  credentials.password.length >= 8 &&
                  /^\S+@\S+\.\S+$/.test(credentials.email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && !loading) {
      onSubmit(credentials);
    }
  };

  const loaction = useLocation()

  return (
    <div className={styles.formCard}>
      <div className={styles.header}>
        <h2>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <svg viewBox="0 0 24 24">
            <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="username"
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.labelRow}>
            <label>Password*</label>
            <button
              type="button"
              className={styles.forgotPassword}
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <div className={styles.rememberMe}>
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={handleChange}
            />
            <span>Remember me</span>
          </label>
        </div>

        <button
          className={`${styles.btnLogin} ${isValid ? styles.active : styles.disabled}`}
          type="submit"
          disabled={!isValid || loading}
        >
          {loading ? (
            <div className={styles.spinner}>
              <div className={styles.doubleBounce1}></div>
              <div className={styles.doubleBounce2}></div>
            </div>
          ) : 'Sign In'}
        </button>
      </form>

      <div className={styles.signupPrompt}>
        <p>Don't have an account? <Link to={location.pathname === '/login' ? '/signup': '/signup/student'}>Sign up</Link></p>
      </div>
    </div>
  );
};

export default LoginForm;