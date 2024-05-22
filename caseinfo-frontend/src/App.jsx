import React from "react";
import { Route, Routes } from "react-router-dom"; // Import Routes and Route
import CaseInfoPage from "./pages/CaseInfoPage";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      
      <div className="Content">
        <Routes>
        
          <Route path="/caseinfo" element={<CaseInfoPage />} />

          {/* Define more routes as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default App;