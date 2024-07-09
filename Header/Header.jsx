import React from "react";
import * as classes from "./Header.module.css";
import Navbar from "./Navbar";
import titleImage from "./TITLE.png";
import logo from "./logo.png";

const HeaderComponent = ({ userRole, currentUserEmail, handleSignOut }) => {
  return (
    <div className={classes.headerComponent}>
      <div className={classes.headerComponentInner}>
        <img className={classes.logo} src={logo} alt="ALD" />
        <img className={classes.titleImage} src={titleImage} alt="Title Logo" />
        <Navbar userRole={userRole} currentUserEmail={currentUserEmail} handleSignOut={handleSignOut} /> {/* Pass userRole to Navbar */}
      </div>
    </div>
  );
};

export default HeaderComponent;
