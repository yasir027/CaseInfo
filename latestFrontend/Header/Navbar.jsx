import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = ({ userRole, currentUserEmail, handleSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, profileButtonRef]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    handleSignOut(); // Call the handleSignOut function to handle any additional sign-out logic
    window.location.reload(); // Refresh the page if needed
  };

  return (
    <div className={styles.navBarDefault}>
      <div className={styles.frame}>
        <NavLink
          exact
          to="/"
          className={({ isActive }) =>
            `${styles.navButton} ${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/recycle-bin"
          className={({ isActive }) =>
            `${styles.navButton} ${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Recycle Bin
        </NavLink>
        {userRole === 'admin' && (
          <NavLink
            to="/UserPrivileges"
            className={({ isActive }) =>
              `${styles.navButton} ${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            User Privileges
          </NavLink>
        )}
        <div className={styles.profileMenu}>
          <button
            ref={profileButtonRef}
            className={styles.navButton}
            onClick={handleDropdownToggle}
          >
            {currentUserEmail ? `${currentUserEmail.substring(0, 5)}` : 'Profile'}
          </button>
          {showDropdown && (
            <div ref={dropdownRef} className={styles.dropdownContent}>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${styles.dropdownItem} ${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                Edit Profile
              </NavLink>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
