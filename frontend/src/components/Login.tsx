import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signIn } from '../services/cognito';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await signIn(email, password);
      // Store the token in localStorage or your preferred state management
      localStorage.setItem('token', token);
      toast.success('Login successful!');
      navigate('/'); // Navigate to home page after successful login
    } catch (error: any) {
      if (error.name === 'UserNotConfirmedException') {
        toast.error('Please verify your email first');
        navigate('/signup');
      } else if (error.name === 'NotAuthorizedException') {
        toast.error('Incorrect email or password');
      } else {
        toast.error(error.message || 'Login failed');
      }
    }
  };

  return (
    <div className="auth-container">
    <div className="auth-form">
      <h2 className="form-title">Login</h2>
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
        <button type="submit" className="auth-button">Login</button>
        <div className="auth-links">
          <a href="/signup" className="auth-link">Don't have an account? Sign up</a>
          <a href="/forgot-password" className="auth-link">Forgot Password?</a>
        </div>
      </form>
    </div>
  </div>
  );
};

export default Login; 