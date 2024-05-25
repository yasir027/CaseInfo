import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false); // State to track if verification email is sent

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendVerificationEmail(user);

      console.log('User created:', user);
      setVerificationSent(true); // Update state to indicate verification email is sent
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    }
  };

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(auth.currentUser); // Send verification email to the current user
      console.log('Verification email sent.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError(error.message);
    }
  };

  return (
    <main>
      <section>
        <div>
          <h1>Signup</h1>
          {verificationSent && (
            <p style={{ color: 'green' }}>Verification email sent. Please check your email to proceed with login.</p>
          )}
          <form>
            <div>
              <label htmlFor="email-address">Email address</label>
              <input
                type="email"
                id="email-address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" onClick={onSubmit}>
              Sign up
            </button>
          </form>
          <p>
            Already have an account?{' '}
            <NavLink to="/login">
              Sign in
            </NavLink>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;
