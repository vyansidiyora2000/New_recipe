import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './SignupForm.css';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { signUp, verifyEmail, resendVerificationCode } from '../services/cognito';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      setShowVerification(true);
      toast.info('Please check your email for verification code');
    } catch (error: any) {
      if (error.name === 'UsernameExistsException') {
        toast.error('This email is already registered. Please try logging in instead.');
      } else {
        toast.error(error.message || 'Signup failed');
      }
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(email, verificationCode);
      toast.success('Email verified successfully! You can now login.');
      navigate('/signin');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    }
  };

  const handleResendCode = async () => {
    try {
      await resendVerificationCode(email);
      toast.info('New verification code sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="form-title">{!showVerification ? 'Sign Up' : 'Verify Email'}</h2>
        
        {!showVerification ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-button">Sign Up</button>
          </form>
        ) : (
          <div className="verification-container">
            <p className="verification-text">Please enter the verification code sent to your email</p>
            <form onSubmit={handleVerification}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-button">Verify Email</button>
              <button 
                type="button" 
                className="resend-button"
                onClick={handleResendCode}
              >
                Resend Code
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;