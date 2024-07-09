import React, { useState, useEffect } from "react";
import axios from "axios";
import Styles from "./RecycleBin.module.css"; // Import your CSS module
import Table from "./Table"; // Assuming you have a Table component

function RecycleBin() {
  const [recycleData, setRecycleData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchRecycleData();
  }, []);

  const fetchRecycleData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/recycle_bin");
      const formattedData = response.data.map(item => ({
        ...item,
        deletedAt: formatDate(item.deletedAt) // Format deletedAt timestamp
      }));
      setRecycleData(formattedData);
    } catch (error) {
      console.error("Error fetching recycle bin data:", error);
      alert("Error fetching recycle bin data. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleRestore = async () => {
    const userEmail = localStorage.getItem('userEmail');

    if (selectedRows.length === 0) {
      alert("Please select rows to restore.");
      return;
    }
    try {
      await Promise.all(selectedRows.map(async (row) => {
        const response = await axios.post(`http://localhost:3000/api/recycle_bin/restore/${row.caseInfoId}`, { userEmail });
        if (response.status !== 200) {
          console.error("Failed to restore case:", response.data);
          throw new Error(`Failed to restore case with ID ${row.caseInfoId}`);
        }
      }));
      alert("Selected cases restored successfully.");
      fetchRecycleData();
      setSelectedRows([]);
    } catch (error) {
      console.error("Error restoring cases:", error);
      alert("An error occurred while restoring cases. Please try again.");
    }
  };

  const handleDeleteSelected = async () => {
    const userEmail = localStorage.getItem('userEmail');

    if (selectedRows.length === 0) {
      alert("Please select rows to delete.");
      return;
    }
    try {
      await Promise.all(selectedRows.map(async (row) => {
        const response = await axios.delete(`http://localhost:3000/api/recycle_bin/delete/${row.caseInfoId}`, {
          data: { userEmail }
        });
        if (response.status !== 200) {
          console.error("Failed to delete case from recycle bin:", response.data);
          throw new Error(`Failed to delete case with ID ${row.caseInfoId}`);
        }
      }));
      alert("Selected cases deleted from recycle bin successfully.");
      fetchRecycleData();
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting cases from recycle bin:", error);
      alert("An error occurred while deleting cases from recycle bin. Please try again.");
    }
  };

  const handleEmptyRecycleBin = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const confirmed = window.confirm("Are you sure you want to empty the recycle bin?");
    if (confirmed) {
      try {
        await axios.delete("http://localhost:3000/api/recycle_bin/empty", {
          data: { userEmail }
        });
        alert("Recycle bin emptied successfully.");
        fetchRecycleData();
        setSelectedRows([]);
      } catch (error) {
        console.error("Error emptying recycle bin:", error);
        alert("An error occurred while emptying recycle bin. Please try again.");
      }
    }
  };

  const handleRowClick = (data) => {
    const index = selectedRows.findIndex((row) => row.caseInfoId === data.caseInfoId);
    if (index === -1) {
      setSelectedRows([...selectedRows, data]);
    } else {
      setSelectedRows(selectedRows.filter((row) => row.caseInfoId !== data.caseInfoId));
    }
  };

  return (
    <div className={Styles.Container}>
      <div className={Styles.formContainer}>
        <div className={Styles.formHeader}>
          <h1><i>Recycle Bin</i></h1>
        </div>
        <div className={Styles.formBody}>
          {recycleData.length > 0 && (
            <Table caseData={recycleData} onRowClick={handleRowClick} selectedRows={selectedRows} />
          )}
          <div className={Styles.row}>
            <div className={Styles.col}>
              <button type="button" onClick={handleRestore} className={Styles.button}>Restore</button>
            </div>
            <div className={Styles.col}>
              <button type="button" onClick={handleDeleteSelected} className={Styles.button}>Delete Selected</button>
            </div>
            <div className={Styles.col}>
              <button type="button" onClick={handleEmptyRecycleBin} className={Styles.button}>Empty Recycle Bin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecycleBin;
