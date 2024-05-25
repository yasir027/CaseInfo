import React from "react";
import { NavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import styles from "./Navbar.module.css";

const Navbar = ({ handleSignOut }) => {
  return (
    <div className={styles.navBarDefault}>
      <div className={styles.frame}>
        <NavLink to="/recycle-bin" className={styles.navButton}>
          Recycle Bin
        </NavLink>
        <NavLink to="/reports" className={styles.navButton}>
          Reports
        </NavLink>
        <NavLink to="/user-privileges" className={styles.navButton}>
          User Privileges
        </NavLink>
        <NavLink to="/profile" className={styles.navButton}>
          Profile Settings
        </NavLink>
        <button onClick={handleSignOut} className={styles.navButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
