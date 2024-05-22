import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  const getClassName = (path) => {
    return window.location.pathname === path
      ? `${styles.navButton} ${styles.active}`
      : styles.navButton;
  };

  return (
    <div className={styles.navBarDefault}>
      <div className={styles.frame}>
        <div className={styles.dropdown}>
          <button
            onClick={handleNavigation("/home")}
            className={getClassName("/home")}
          >
            HOME
          </button>
          <div className={styles.dropdownContent}>
            <button onClick={handleNavigation("/about")}>ABOUT</button>
            <button onClick={handleNavigation("/contact")}>CONTACT</button>
            <button onClick={handleNavigation("/help")}>HELP</button>
          </div>
        </div>
        <button onClick={handleNavigation("/index")} className={getClassName("/index")}>
          INDEX
        </button>
        <button
          onClick={handleNavigation("/case-finder")}
          className={getClassName("/case-finder")}
        >
          CASE FINDER
        </button>
        <button onClick={handleNavigation("/statutes")} className={getClassName("/statutes")}>
          STATUTES
        </button>
        <button onClick={handleNavigation("/articles")} className={getClassName("/articles")}>
          ARTICLES
        </button>
        <button
          onClick={handleNavigation("/judges-profile")}
          className={getClassName("/judges-profile")}
        >
          JUDGES PROFILE
        </button>
        <button onClick={handleNavigation("/pad")} className={getClassName("/pad")}>
          PAD
        </button>
        <button
          onClick={handleNavigation("/caseinfo")}
          className={getClassName("/caseinfo")}
        >
          CASE INFO
        </button>
      </div>
    </div>
  );
};

export default Navbar;
