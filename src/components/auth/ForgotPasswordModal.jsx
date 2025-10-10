// src/Login/ForgotPasswordModal.jsx
import { useState } from 'react';
import authApi from '../../api/authApi';

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const isValid = /^\S+@\S+\.\S+$/.test(email);
  
  const sendForgotPasswordEmail = async() => {
    try{
      await authApi.forgotPassword(email);
      return true;
    }catch(error){
      setError(error.message);
      return false;
    }
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!isValid) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    const isEmailSent = await sendForgotPasswordEmail(email);
    setSubmitted(isEmailSent);
  };

  return (
    <div className="modal-overlay">
      <div className="forgot-modal">
        <button className="close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <div className="icon">
          <svg viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </div>
        
        <h2>Reset your password</h2>
        
        {submitted ? (
          <div className="success-message">
            <p>We've sent password reset instructions to <strong>{email}</strong>.</p>
            <p>Please check your inbox and follow the instructions.</p>
          </div>
        ) : (
          <>
            <p className="subtitle">
              Enter your email and we'll send you instructions to reset your password.
            </p>
            
            {error && (
              <div className="error-banner">
                <svg viewBox="0 0 24 24">
                  <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className='no-center'>Email*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>
              
              <button 
                className={`btn-reset ${isValid ? 'active' : 'disabled'}`}
                type="submit"
              >
                Send Reset Instructions
              </button>
            </form>
          </>
        )}
        
        <div className="back-to-login">
          <button onClick={onClose}>
            <svg viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;