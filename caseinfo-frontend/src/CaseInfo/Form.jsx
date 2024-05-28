import React, { useState, useEffect } from "react";
import axios from "axios";
import Styles from "./Form.module.css";
import Table from "./Table";

function Form() {
  const initialFormData = {
    caseInfoId: "",
    caseInfoState: "",
    caseInfoDOJ: "",
    caseInfoCaseType: "",
    caseInfoCaseNo: "",
    caseInfoCaseYear: "",
    caseInfoJudgeName: "",
    caseInfoPartyName: "",
    caseInfoCitation: "",
    caseInfoRemarks: "",
    fromDate: "",
    toDate: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [caseData, setCaseData] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const duplicateCheck = caseData.some(
      (item) =>
        item.caseInfoState === formData.caseInfoState &&
        item.caseInfoDOJ === formData.caseInfoDOJ &&
        item.caseInfoJudgeName === formData.caseInfoJudgeName &&
        item.caseInfoCaseType === formData.caseInfoCaseType &&
        item.caseInfoCaseNo === formData.caseInfoCaseNo &&
        item.caseInfoCaseYear === formData.caseInfoCaseYear &&
        item.caseInfoPartyName === formData.caseInfoPartyName &&
        item.caseInfoCitation === formData.caseInfoCitation &&
        item.caseInfoRemarks === formData.caseInfoRemarks
    );

    if (duplicateCheck) {
      alert(
        "This case information already exists. Please enter different details."
      );
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/addCaseInfo", formData);
      setFormData(initialFormData);
      fetchCaseData();
    } catch (error) {
      console.error("Error adding case info:", error);
      alert("Error adding case info. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const { caseInfoId } = formData;
      if (!caseInfoId) {
        alert("Please enter the Case ID to delete.");
        return;
      }
  
      // Confirmation prompt
      const isConfirmed = window.confirm("Are you sure you want to delete this case?");
      if (!isConfirmed) {
        return; // Exit the function if the user cancels the deletion
      }
  
      // Proceed with the deletion if confirmed
      const response = await axios.delete(`http://localhost:3000/api/deleteCaseInfo/${caseInfoId}`);
  
      if (response.status === 200) {
        alert("Case moved to recycle bin successfully.");
        // Handle successful deletion
        setFormData(initialFormData);
        fetchCaseData();
      } else {
        alert("Failed to delete the case. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting case info:", error);
      alert("An error occurred while deleting the case. Please try again.");
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const fetchCaseData = async () => {
    try {
      const queryParams = new URLSearchParams(searchQuery).toString();
      const response = await axios.get(`http://localhost:3000/api/caseInfo?${queryParams}`);
      const formattedData = response.data.map(item => ({
        ...item,
        caseInfoDOE: formatDate(item.caseInfoDOE)
      }));
      setCaseData(formattedData);
    } catch (error) {
      console.error("Error fetching case data:", error);
      alert("Error fetching case data. Please try again.");
    }
  };

  const handleUpdate = async () => {
    if (!isUpdateMode) {
      alert("Please select a case to update.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/updateCaseInfo/${formData.caseInfoId}`, formData);
      setIsUpdateMode(false);
      setFormData(initialFormData);
      fetchCaseData();
    } catch (error) {
      console.error("Error updating case info:", error);
    }
  };

  const handleSearch = () => {
    const query = { ...formData };
  
    // Remove empty fields from the query object
    Object.keys(query).forEach(key => {
      if (!query[key]) {
        delete query[key];
      }
    });
  
    // Perform the search with the query parameters
    axios.get("http://localhost:3000/api/caseInfo", { params: query })
      .then(response => {
        setCaseData(response.data);
      })
      .catch(error => {
        console.error("Error fetching case info:", error);
        alert("Error fetching case info. Please try again.");
      });
  };
  
  const handleRefresh = () => {
    setFormData(initialFormData);
    setIsUpdateMode(false);
    setSearchQuery({});
    fetchCaseData();
  };

  const handleRowClick = (data) => {
    console.log("Clicked row data:", data);
    setFormData(data);
    setIsUpdateMode(true);
  };

  const printTable = () => {
    const content = document.getElementById("print-table").innerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.body.innerHTML = `
      <html>
        <head>
          <title>Print Table</title>
          <style>
            @media print {
              body {
                font-size: 12pt;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              table th,
              table td {
                border: 1px solid #dddddd;
                font-size: 10px;
                text-align: left;
                padding: 8px;
              }
              table th {
                background-color: #f2f2f2;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
    newWindow.print();
  };

  const handleClear = () => {
    setFormData(initialFormData);
  };

  useEffect(() => {
    fetchCaseData();
  }, [searchQuery]);

  return (
    <div className={Styles.Container}>
      <div className={Styles.formContainer}>
        <div className={Styles.formHeader}>
          <h1>
            <i>ALD Case Info</i>
          </h1>
        </div>
        <div className={Styles.formBody}>
          <form onSubmit={handleSubmit}>
            {/* Input fields for case information */}
            <div className={Styles.row}>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoState"
                  value={formData.caseInfoState}
                  onChange={handleChange}
                  placeholder="Court"
                />
              </div>
              <div className={Styles.col}>
                <input
                  type="date"
                  name="caseInfoDOJ"
                  value={formData.caseInfoDOJ}
                  onChange={handleChange}
                  placeholder="Date of Judgment"
                />
              </div>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoJudgeName"
                  value={formData.caseInfoJudgeName}
                  onChange={handleChange}
                  placeholder="Judge Name"
                />
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoCaseType"
                  value={formData.caseInfoCaseType}
                  onChange={handleChange}
                  placeholder="Case Type"
                />
              </div>
              <div className={Styles.col}>
                <input
                  type="number"
                  name="caseInfoCaseNo"
                  value={formData.caseInfoCaseNo}
                  onChange={handleChange}
                  placeholder="Case Number"
                />
              </div>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoCaseYear"
                  value={formData.caseInfoCaseYear}
                  onChange={handleChange}
                  placeholder="Case Year"
                />
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoPartyName"
                  value={formData.caseInfoPartyName}
                  onChange={handleChange}
                  placeholder="Name of Parties"
                />
              </div>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoCitation"
                  value={formData.caseInfoCitation}
                  onChange={handleChange}
                  placeholder="Citations"
                />
              </div>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoRemarks"
                  value={formData.caseInfoRemarks}
                  onChange={handleChange}
                  placeholder="Remarks"
                />
              </div>
            </div>
            <div className={Styles.row}>
  <div className={Styles.col}>
    <label htmlFor="fromDate">From Date</label>
    <input
      type="date"
      id="fromDate"
      name="fromDate"
      value={formData.fromDate}
      onChange={handleChange}
    />
  </div>
  <div className={Styles.col}>
    <label htmlFor="toDate">To Date</label>
    <input
      type="date"
      id="toDate"
      name="toDate"
      value={formData.toDate}
      onChange={handleChange}
    />
  </div>
</div>
            {/* Action buttons */}
            <div className={Styles.row}>
              <div className={Styles.col}>
                <button type="submit" className={Styles.button}>
                  Add
                </button>
              </div>
              <div className={Styles.col}>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className={Styles.button}
                >
                  Update
                </button>
              </div>
              <div className={Styles.col}>
                <button
                  type="button"
                  onClick={handleClear}
                  className={Styles.button}
                >
                  Clear
                </button>
              </div>
              <div className={Styles.col}>
                <button
                  type="button"
                  onClick={handleSearch}
                  className={Styles.button}
                >
                  Search
                </button>
              </div>
              <div className={Styles.col}>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className={Styles.button}
                >
                  Refresh
                </button>
              </div>
              <div className={Styles.col}>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={Styles.button}
                >
                  Delete
                </button>
              </div>
              <div className={Styles.col}>
                <button
                  type="button"
                  onClick={printTable}
                  className={Styles.button}
                >
                  Print Table
                </button>
              </div>
             
            </div>
          </form>
          {/* Display table of case data */}
          {caseData.length > 0 && (
            <div id="print-table">
              <Table caseData={caseData} onRowClick={handleRowClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Form;
