import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import CaseInfoPage from './pages/CaseInfoPage';
import Header from './Header/Header';
import RecycleBin from './CaseInfo/RecycleBin';
import Reports from './CaseInfo/Reports';
import Popup from './CaseInfo/Popup';
import Profile from './CaseInfo/Profile';
import UserPrivileges from './CaseInfo/UserPrivileges';
import './App.css';

const App = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [userRole, setUserRole] = useState(null); // Initialize with no role
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [showNotAllowedDialog, setShowNotAllowedDialog] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('currentUserEmail');
    if (storedUserRole && storedEmail) {
      setUserRole(storedUserRole);
      setCurrentUserEmail(storedEmail);
      setShowPopup(false); // Hide popup if user role and email are already stored
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.notAllowed) {
      setShowNotAllowedDialog(true);
    }
  }, [location]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleLogin = (role, email) => {
    setUserRole(role); // Set the user role received from Popup component
    setCurrentUserEmail(email); // Set the current user's email
    localStorage.setItem('userRole', role); // Save user role to localStorage
    localStorage.setItem('currentUserEmail', email); // Save email to localStorage
    setShowPopup(false); // Close the popup after successful login
    navigate('/'); // Redirect to home page
  };

  const handleSignOut = () => {
    localStorage.removeItem('userRole'); // Remove user role from localStorage
    localStorage.removeItem('currentUserEmail'); // Remove email from localStorage
    setUserRole(null); // Reset user role state
    setCurrentUserEmail(''); // Reset current user email state
    navigate('/'); // Redirect to home page
    // Handle any additional sign-out logic
  };

  const closeNotAllowedDialog = () => {
    setShowNotAllowedDialog(false);
  };

  return (
    <div className="App">
      <div className={`blur-container ${showPopup ? 'blur' : ''}`}>
        <Header userRole={userRole} currentUserEmail={currentUserEmail} handleSignOut={handleSignOut} /> {/* Pass userRole and handleSignOut to Header */}
        <div className="Content">
          <Routes>
            <Route path="/" element={<CaseInfoPage />} />
            <Route path="/recycle-bin" element={<RecycleBin />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/UserPrivileges" 
              element={
                userRole === 'admin' ? <UserPrivileges /> : <Navigate to="/" replace state={{ notAllowed: true }} />
              } 
            />
          </Routes>
        </div>
      </div>
      {showPopup && <Popup onLogin={handleLogin} onClose={handleClosePopup} />} {/* Pass handleLogin to Popup */}
      {showNotAllowedDialog && (
        <div className="dialog">
          <div className="dialog-content">
            <p>Not allowed</p>
            <button onClick={closeNotAllowedDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
