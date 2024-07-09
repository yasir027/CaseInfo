import React, { useState, useEffect } from 'react';
import Styles from './Profile.module.css';

const Profile = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      const userId = localStorage.getItem('userId');
      if (email) {
        setCurrentUserEmail(email);
      } else {
        console.error('No email found in local storage.');
      }
      if (userId) {
        setCurrentUserId(userId);
      } else {
        console.error('No user ID found in local storage.');
      }
    } catch (error) {
      console.error('Error fetching data from local storage:', error);
    }
  }, []);

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    try {
      if (!currentUserId) {
        alert('User ID not found in local storage.');
        return;
      }
      const response = await fetch('http://localhost:3000/api/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId, newEmail }),
      });
      if (response.ok) {
        alert('Email changed successfully');
        setCurrentUserEmail(newEmail);
        setNewEmail('');
      } else {
        alert('Failed to change email');
      }
    } catch (error) {
      console.error('Error changing email:', error);
      alert('Failed to change email');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      if (!currentUserId) {
        alert('User ID not found in local storage.');
        return;
      }
      const response = await fetch('http://localhost:3000/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId, currentPassword: password, newPassword }),
      });
      if (response.ok) {
        alert('Password changed successfully');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const responseText = await response.text();
        alert(`Failed to change password: ${responseText}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  return (
    <div className={Styles.Container}>
      <div className={Styles.formContainer}>
        <h1 className={Styles.formHeader}>Profile Settings</h1>
        <div className={Styles.formBody}>
          <div className={Styles.section}>
            <h2>Email</h2>
            <p>Current Email: {currentUserEmail}</p>
            <form onSubmit={handleChangeEmail}>
              <label className={Styles.label}>New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={Styles.input}
                required
              />
              <button type="submit" className={Styles.button}>Change Email</button>
            </form>
          </div>
          <div className={Styles.section}>
            <h2>Password</h2>
            <form onSubmit={handleChangePassword}>
              <label className={Styles.label}>Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={Styles.input}
                required
              />
              <label className={Styles.label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={Styles.input}
                required
              />
              <label className={Styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={Styles.input}
                required
              />
              <button type="submit" className={Styles.button}>Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
