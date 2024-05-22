import React from "react";
import Styles from "./Dash.module.css"; // Ensure this import points to the correct file
function Dash() {
  


  return (
  <div className={Styles.container}>
  
    <div className={Styles.contents}>
      <div className={Styles.admin}>
        <div className={Styles.rectangle}> </div>
        Admin
        <div> ALD@gmail.com </div>

      </div>
    </div>
    <button className={Styles.contents}>ALD Home</button>
    <button className={Styles.contents}>Index</button>
    <button className={Styles.contents}>Case Finder</button>
    <button className={Styles.contents}>Statues</button>
    <button className={Styles.contents}>Accounts</button>
    <button className={Styles.contents}>Settings</button>
  </div>
  );
}

export default Dash;
