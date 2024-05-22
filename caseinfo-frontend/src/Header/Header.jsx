import React from "react";
import { Link } from "react-router-dom";
import * as classes from "./Header.module.css";
import Navbar from "./Navbar";

import titleImage from "./TITLE.png"; // Import the image using a relative path

export const HeaderComponent = () => {
  return (
    <div className={classes.headerComponent}>
      {/* Use the imported image */}
      <img
        className={classes.titleImage}
        src={titleImage}
        alt="Title Logo"
      />

      <div className={classes.headerComponentInner}>
        <Navbar className={classes.navBarDefault} />

        <Link to="/login">
          <button className={classes.loginButton}>LOGIN</button>
        </Link>
      </div>
    </div>
  );
};

export default HeaderComponent;
