import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import CaseInfoPage from "./pages/CaseInfoPage";
import Header from "./Header/Header";
import Signup from "./CaseInfo/Signup";
import Login from "./CaseInfo/Login";
import Profile from "./CaseInfo/Profile";
import RecycleBin from "./CaseInfo/RecycleBin";
import Reports from "./CaseInfo/Reports";
import UserPrivileges from "./CaseInfo/UserPrivileges";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="App">
      <Header user={user} handleSignOut={handleSignOut} />
      <div className="Content">
        <Routes>
          {/* Protected route - only accessible when authenticated */}
          {user ? (
            <>
              <Route path="/" element={<CaseInfoPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recycle-bin" element={<RecycleBin />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/user-privileges" element={<UserPrivileges />} />
            </>
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}

          {/* Authentication routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect to login if route doesn't match */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
