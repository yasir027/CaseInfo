import React, { useState, useEffect } from "react";
import axios from "axios";
import Styles from "./Form.module.css";
import Table from "./Table";


export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};


const fetchData = async (url, setData) => {
  try {
    const response = await axios.get(url);
    setData(response.data);
    console.log(`${url} fetched:`, response.data);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
};

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
  const [searchQueryText, setSearchQueryText] = useState("");
  const [courts, setCourts] = useState([]);
  const [judgeNames, setJudgeNames] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
const [partyNames, setPartyNames] = useState([]);
const [citations, setCitations] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [page, setPage] = useState(1); // Initial page number


  const columnNamesMapping = {
    caseInfoState: "Court",
    caseInfoDOJ: "DOJ",
    caseInfoCaseType: "Type",
    caseInfoCaseNo: "Case No",
    caseInfoCaseYear: "Year",
    caseInfoJudgeName: "Judge",
    caseInfoPartyName: "Name of Parties",
    caseInfoCitation: "Citation",
    caseinfodoe: "DOE", // Ensure this matches the exact key from the backend
    caseInfoRemarks: "Status",
      caseinfouser: "User"
    };

    const formatSearchQueryText = (searchQuery, mapping) => {
        return Object.entries(searchQuery)
          .map(([key, value]) => `${mapping[key] || key}: ${value}`)
             .join(", ");
          };
      

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
              alert("This case information already exists. Please enter different details.");
              return;
            }
          
            try {
              // Retrieve currentUserEmail from localStorage
              const currentUserEmail = localStorage.getItem("currentUserEmail");
          
              // Include currentUserEmail in formData
              const postData = {
                ...formData,
                currentUserEmail: currentUserEmail,
              };
          
              // Post formData to backend
              await axios.post("http://localhost:3000/api/addCaseInfo", postData);
              setFormData(initialFormData);
              fetchCaseData(); // Assuming fetchCaseData() fetches updated case data
              alert("Case added successfully.");
            } catch (error) {
              console.error("Error adding case info:", error);
              alert("Error adding case info. Please try again.");
            }
          };

    
          
    useEffect(() => {
            if (Object.values(formData).some((value) => value !== "")) {
              handleSearch();
            } else {
              setCaseData([]);
            }
          }, [formData]);

          const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          };

//delete function
          const handleDelete = async () => {
            try {
              const { caseInfoId } = formData;
              if (!caseInfoId) {
                alert("Please enter the Case ID to delete.");
                return;
              }
          
              const isConfirmed = window.confirm("Are you sure you want to delete this case?");
              if (!isConfirmed) {
                return;
              }
          
              // Get current user's email from localStorage
              const currentUserEmail = localStorage.getItem('currentUserEmail');
          
              // Send caseInfoId and currentUserEmail in the request body
              const response = await axios.delete(`http://localhost:3000/api/deleteCaseInfo/${caseInfoId}`, {
                data: {
                  currentUserEmail: currentUserEmail
                }
              });
          
              if (response.status === 200) {
                alert("Case moved to recycle bin successfully.");
                setFormData(initialFormData);
                fetchCaseData(); // Example function to fetch updated data
              } else {
                alert("Failed to delete the case. Please try again.");
              }
            } catch (error) {
              console.error("Error deleting case info:", error);
              alert("An error occurred while deleting the case. Please try again.");
            }
          };
          
           
//lazyloading
 
          const fetchCaseData = async () => {
            try {
              setIsLoading(true);
              const queryParams = new URLSearchParams({
                ...searchQuery,
                page: page,
                limit: 10, // Example limit per page
              }).toString();
              const response = await axios.get(`http://localhost:3000/api/caseInfo?${queryParams}`);
              setCaseData(response.data); // Set new data for the current page
            } catch (error) {
              console.error("Error fetching case data:", error);
              alert("Error fetching case data. Please try again.");
            } finally {
              setIsLoading(false);
            }
          };
          
          useEffect(() => {
            fetchCaseData();
          }, [page, searchQuery]); // Trigger fetch on page or search query change
          

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        // Load more data when scrolled to the bottom
        setPage(prevPage => prevPage + 1); // Increment page number
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  const handleUpdateClick = async () => {
    if (!isUpdateMode) {
      alert("Please select a case to update.");
      return;
    }
  
    // Modify the date format before sending it to the server
    const formattedFormData = {
      ...formData,
      caseinfodoe: formatDate(formData.caseinfodoe),
    };
  
    try {
      await axios.put(`http://localhost:3000/api/updateCaseInfo/${formattedFormData.caseInfoId}`, formattedFormData);
      setIsUpdateMode(false);
      setFormData(initialFormData);
      fetchCaseData();
      alert("Case updated successfully."); // Alert message for successful update
    } catch (error) {
      console.error("Error updating case info:", error);
      alert("Error updating case info. Please try again.");
    }
  };

  //function to fetch dropdowns
  useEffect(() => {
    fetchData("http://localhost:3000/api/data?distinct=courts", setCourts);
    fetchData("http://localhost:3000/api/data?distinct=judgeNames", setJudgeNames);
    fetchData("http://localhost:3000/api/data?distinct=caseTypes", setCaseTypes);
    fetchData("http://localhost:3000/api/data?distinct=partyNames", setPartyNames);
    fetchData("http://localhost:3000/api/data?distinct=citations", setCitations);
  }, []);

  const handleSearch = () => {
    const query = { ...formData };
  
    Object.keys(query).forEach(key => {
      if (!query[key]) {
        delete query[key];
      }
    });
  
    axios.get("http://localhost:3000/api/caseInfo", { params: query })
      .then(response => {
        setCaseData(response.data);
        setSearchQuery(query); // Update searchQuery with the new parameters
        setSearchQueryText(formatSearchQueryText(query, columnNamesMapping)); // Update searchQueryText
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
    const table = document.getElementById("print-table");
    const clonedTable = table.cloneNode(true); // Clone the table to avoid modifying the original

    // Remove the first column (Serial Number) from the cloned table
    const rows = clonedTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].deleteCell(0); // Assuming Serial Number is the first cell in each row
    }

    // Remove pagination controls from the cloned table
    const paginationControls = clonedTable.querySelectorAll(".pagination, .pagination *");
    paginationControls.forEach(control => control.remove());

    const content = clonedTable.innerHTML;
    const rowCount = rows.length - 1; // Subtracting 1 for the header row

    const modifyJudgeName = (text) => {
      const regex = /Judge: ([^,]+)/;
      const match = text.match(regex);
      if (match) {
        return text.replace(match[0], `Judge: Honorable ${match[1]}`);
      }
      return text;
    };

    const modifiedSearchQueryText = modifyJudgeName(searchQueryText);

    const newWindow = window.open("", "_blank");
    newWindow.document.body.innerHTML = `
      <html>
        <head>
          <title>Print</title>
          <style>
            @media print {
              body {
                font-size: 12pt; /* Decreased font size */
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
              }
              table th,
             table td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 6px;
              font-size: 8pt; /* Decreased font size for table cells */
            }
              table th {
                background-color: #f2f2f2;
              }
              header, footer {
                text-align: center;
                margin: 15px 0;
              }
              .pagination {
                display: none; /* Hide pagination controls */
              }
            }
          </style>
        </head>
        <body>
          <header>
            <h1>ALD Case Info</h1>
            ${modifiedSearchQueryText ? `<p>Search Query: ${modifiedSearchQueryText}</p>` : ""}
            <p>No of Judgements: ${rowCount}</p>
          </header>
          ${content}
          <footer>
            <p>&copy; 2024 ALD Online. All rights reserved.</p>
          </footer>
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
            <div className={Styles.row}>
              <div className={Styles.doj}>
              <input
                  list="data-courts"
                  type="text"
                  name="caseInfoState"
                  value={formData.caseInfoState}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Court"
                />
                <datalist id="data-courts">
                  {courts.map((court, index) => (
                    <option key={index} value={court.caseInfoState}>
                      {court.caseInfoState}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className={Styles.doj}>
                <input
                  type="text"
                  name="caseInfoDOJ"
                  value={formData.caseInfoDOJ}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Date of Judgment"
                />
              </div>
              <div className={Styles.col}>
                <input
                  list="data-judgeNames"
                  type="text"
                  name="caseInfoJudgeName"
                  value={formData.caseInfoJudgeName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Judge Name"
                />
                <datalist id="data-judgeNames">
                  {judgeNames.map((judge, index) => (
                    <option key={index} value={judge.caseInfoJudgeName}>
                      {judge.caseInfoJudgeName}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
            <div className={Styles.row}>
          <div className={Styles.col}>
            <input
              list="data-caseTypes"
              type="text"
              name="caseInfoCaseType"
              value={formData.caseInfoCaseType}
              onChange={handleChange}
              className="form-control"
              placeholder="Case Type"
            />
            <datalist id="data-caseTypes">
              {caseTypes.map((type, index) => (
                <option key={index} value={type.caseInfoCaseType}>
                  {type.caseInfoCaseType}
                </option>
              ))}
            </datalist>
          </div>
              <div className={Styles.col}>
                <input
                  type="number"
                  name="caseInfoCaseNo"
                  value={formData.caseInfoCaseNo}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Case Number"
                />
              </div>
              <div className={Styles.col}>
                <input
                  type="text"
                  name="caseInfoCaseYear"
                  value={formData.caseInfoCaseYear}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Case Year"
                />
              </div>
            </div>
            <div className={Styles.row}>
          <div className={Styles.col}>
            <input
              list="data-partyNames"
              type="text"
              name="caseInfoPartyName"
              value={formData.caseInfoPartyName}
              onChange={handleChange}
              className="form-control"
              placeholder="Name of Parties"
            />
            <datalist id="data-partyNames">
              {partyNames.map((party, index) => (
                <option key={index} value={party.caseInfoPartyName}>
                  {party.caseInfoPartyName}
                </option>
              ))}
            </datalist>
          </div>
          <div className={Styles.col}>
            <input
              list="data-citations"
              type="text"
              name="caseInfoCitation"
              value={formData.caseInfoCitation}
              onChange={handleChange}
              className="form-control"
              placeholder="Citations"
            />
            <datalist id="data-citations">
              {citations.map((citation, index) => (
                <option key={index} value={citation.caseInfoCitation}>
                  {citation.caseInfoCitation}
                </option>
              ))}
            </datalist>
          </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.col}>
                <label htmlFor="caseInfoRemarks" className={`form-label ${Styles.label}`}>
                  Add Remarks
                </label>
                <input
                  type="text"
                  name="caseInfoRemarks"
                  value={formData.caseInfoRemarks}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="form-control"
                  placeholder="Remarks"
                />
              </div>
              <div className={Styles.col}>
                <div className={Styles.doe}>
                  <label htmlFor="fromDate" className={`form-label ${Styles.label}`}>
                    From Date
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`form-control ${Styles.input}`}
                    placeholder="From Date"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div className={Styles.col}>
                <div className={Styles.doe}>
                  <label htmlFor="toDate" className={`form-label ${Styles.label}`}>
                    To Date
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`form-control ${Styles.input}`}
                    placeholder="To Date"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div className={Styles.row}>
              <div className={Styles.col}>
                <button type="submit" className={Styles.button}>
                  Add
                </button>
              </div>
              <div className={Styles.col}>
                <button
                  type="button"
                  onClick={handleUpdateClick}
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
                  Print
                </button>
              </div>
            </div>
          </form>

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