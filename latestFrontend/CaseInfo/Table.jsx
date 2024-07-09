import React, { useState, useEffect, useRef } from "react";
import Styles from "./Table.module.css"; // Import your CSS module
import { formatDate } from "./Form.jsx"; // Import the formatDate function

const placeholderHeaders = {
  caseInfoId: "S.No",
  caseInfoState: "Court",
  caseInfoDOJ: "DOJ",
  caseInfoCaseType: "Type",
  caseInfoCaseNo: "Case No",
  caseInfoCaseYear: "Year",
  caseInfoJudgeName: "Judge",
  caseInfoPartyName: "Name of Parties",
  caseInfoCitation: "Citation",
  caseInfoDOE: "DOE", // Ensure this matches the exact key from the backend
  caseInfoRemarks: "Status",
  caseInfoUser: "User"
  // Add more mappings as needed
};

const Table = ({ caseData, onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null); // Track selected row
  const [pageNumbers, setPageNumbers] = useState([1]);
  const entriesPerPage = 100; // Number of entries per page
  const tableRef = useRef(null);

  // Calculate the total number of pages
  const totalPages = Math.ceil(caseData.length / entriesPerPage);

  // Calculate index of the first and last entry on the current page
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = caseData.slice(indexOfFirstEntry, indexOfLastEntry);

  // Function to handle page changes
  const handlePageChange = (pageNumber, event) => {
    if (event) {
      event.preventDefault(); // Prevent anchor/button default action
    }
    setCurrentPage(pageNumber);
    updatePageNumbers(pageNumber);
  };

  // Update page numbers based on current page
  const updatePageNumbers = (pageNumber) => {
    let newPageNumbers = [];

    // Calculate new page numbers based on the current page
    if (pageNumber <= 3) {
      newPageNumbers = [1, 2, 3];
    } else if (pageNumber >= totalPages - 2) {
      newPageNumbers = [totalPages - 2, totalPages - 1, totalPages];
    } else {
      newPageNumbers = [pageNumber - 1, pageNumber, pageNumber + 1];
    }

    setPageNumbers(newPageNumbers.filter(num => num > 0 && num <= totalPages));
  };

  // Ensure page numbers are updated when currentPage changes
  useEffect(() => {
    if (totalPages > 1) {
      updatePageNumbers(currentPage);
    }
  }, [currentPage, totalPages]);

  // Function to scroll the table to the top
  const scrollIntoView = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Function to handle row click
  const handleRowClick = (data) => {
    setSelectedRow(data.caseInfoId === selectedRow ? null : data.caseInfoId); // Toggle selected row
    onRowClick(data);
    setCurrentPage(1); // Reset to page 1 when a row is clicked
  };

  return (
    <div>
      <div className={Styles.tableContainer} ref={tableRef}>
        <table className={Styles.customTable}>
          <thead>
            <tr>
              {Object.keys(caseData[0] || {}).map((header) => (
                <th key={header} className={Styles.customTh}>
                  {placeholderHeaders[header] || header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((data, index) => (
              <tr
                key={index}
                className={`${Styles.customTr} ${data.caseInfoId === selectedRow ? Styles.selected : ''}`}
                onClick={() => handleRowClick(data)}
              >
                {Object.entries(data).map(([key, value], idx) => (
                  <td key={idx} className={Styles.customTd}>
                    {key === "caseInfoDOE" ? formatDate(value) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Only render when there are multiple pages */}
      {totalPages > 1 && (
        <div className={Styles.pagination}>
          <button
            onClick={(e) => handlePageChange(1, e)}
            disabled={currentPage === 1}
            className={Styles.pageButton}
          >
            First
          </button>
          <button
            onClick={(e) => handlePageChange(currentPage - 1, e)}
            disabled={currentPage === 1}
            className={Styles.pageButton}
          >
            Previous
          </button>
          {pageNumbers[0] > 1 && <span className={Styles.ellipsis}>...</span>}
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={(e) => handlePageChange(page, e)}
              className={`${Styles.pageButton} ${currentPage === page ? Styles.activePage : ""}`}
            >
              {page}
            </button>
          ))}
          {pageNumbers[pageNumbers.length - 1] < totalPages && <span className={Styles.ellipsis}>...</span>}
          <button
            onClick={(e) => handlePageChange(currentPage + 1, e)}
            disabled={currentPage === totalPages}
            className={Styles.pageButton}
          >
            Next
          </button>
          <button
            onClick={(e) => handlePageChange(totalPages, e)}
            disabled={currentPage === totalPages}
            className={Styles.pageButton}
          >
            Last
          </button>
          {/* Scroll to Top Button */}
          <button className={Styles.scrollTopButton} onClick={scrollIntoView}>
            &#8679;
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
