import React from "react";
import * as classes from "./Header.module.css";
import Navbar from "./Navbar";
import titleImage from "./TITLE.png"; // Import the image using a relative path

const HeaderComponent = ({ user, handleSignOut }) => {
  return (
    <div className={classes.headerComponent}>
      <div className={classes.headerComponentInner}>
        <img className={classes.titleImage} src={titleImage} alt="Title Logo" />
        <Navbar user={user} handleSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default HeaderComponent;
