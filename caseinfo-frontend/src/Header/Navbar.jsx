import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = ({ user, handleSignOut }) => {
  return (
    <div className={styles.navBarDefault}>
      <div className={styles.frame}>
        <Link to="/recycle-bin" className={styles.navButton}>
          Recycle Bin
        </Link>
        <Link to="/reports" className={styles.navButton}>
          Reports
        </Link>
        <Link to="/user-privileges" className={styles.navButton}>
          User Privileges
        </Link>
        <Link to="/profile" className={styles.navButton}>
          Profile Settings
        </Link>
        {user && (
          <button onClick={handleSignOut} className={styles.navButton}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
