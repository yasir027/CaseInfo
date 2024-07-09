import React, { useState } from 'react';
import styles from './Popup.module.css';

const Popup = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      alert('User created successfully');
      setIsLogin(true);
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const userRole = data.role; // Assuming the server responds with { role: 'user' | 'admin', userId: 'someUserId' }
        const userId = data.userId;

        alert(data.message);
        localStorage.setItem('userRole', userRole); // Store user role in localStorage
        localStorage.setItem('currentUserEmail', email); // Store email in localStorage
        localStorage.setItem('userId', userId); // Store userId in localStorage
        onLogin(userRole, email); // Call onLogin with the user's role and email
      } else {
        const textData = await response.text();
        alert(textData); // Handle plain text response
      }

      // Close popup after successful login
      onClose();
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Access denied, Contact admin');
    }
  };

  return (
    <div className={styles['popup-overlay']}>
      <div className={styles['popup-content']}>
        {isLogin ? (
          <div className={styles['login-form']}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
            <p onClick={handleToggle}>Don't have an account? Sign up</p>
          </div>
        ) : (
          <div className={styles['signup-form']}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="submit">Sign Up</button>
            </form>
            <p onClick={handleToggle}>Already have an account? Login</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
