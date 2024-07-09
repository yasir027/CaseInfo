import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Styles from './UserPrivileges.module.css';
import TableUsers from './TableUsers';

function ProfilePrivileges() {
  const [userData, setUserData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error fetching user data. Please try again.');
    }
  };

  const handlePromoteSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select rows to promote.');
      return;
    }
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          try {
            await axios.post(`http://localhost:3000/api/promoteUser/${row.id}`);
            console.log(`User ${row.id} promoted successfully.`);
          } catch (error) {
            console.error(`Error promoting user ${row.id}:`, error);
            throw error; // Rethrow the error to handle at the outer catch block
          }
        })
      );
      alert('Selected users promoted successfully.');
      fetchUserData();
      // Do not clear selectedRows here
    } catch (error) {
      console.error('Error promoting users:', error);
      alert('An error occurred while promoting users. Please try again.');
    }
  };

  const handleDemoteSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select rows to demote.');
      return;
    }
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          try {
            await axios.post(`http://localhost:3000/api/demoteUser/${row.id}`);
            console.log(`User ${row.id} demoted successfully.`);
          } catch (error) {
            console.error(`Error demoting user ${row.id}:`, error);
            throw error; // Rethrow the error to handle at the outer catch block
          }
        })
      );
      alert('Selected admins demoted to users successfully.');
      fetchUserData();
      // Do not clear selectedRows here
    } catch (error) {
      console.error('Error demoting users:', error);
      alert('An error occurred while demoting users. Please try again.');
    }
  };

  const handleApproveSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select rows to approve.');
      return;
    }
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          try {
            await axios.post(`http://localhost:3000/api/approveUser/${row.id}`);
            console.log(`User ${row.id} approved successfully.`);
          } catch (error) {
            console.error(`Error approving user ${row.id}:`, error);
            throw error; // Rethrow the error to handle at the outer catch block
          }
        })
      );
      alert('Selected users approved successfully.');
      fetchUserData();
      // Do not clear selectedRows here
    } catch (error) {
      console.error('Error approving users:', error);
      alert('An error occurred while approving users. Please try again.');
    }
  };

  const handleDeclineSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select rows to decline access.');
      return;
    }
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await axios.post(`http://localhost:3000/api/declineUser/${row.id}`);
        })
      );
      alert('Selected users access declined successfully.');
      fetchUserData();
      // Do not clear selectedRows here
    } catch (error) {
      console.error('Error declining user access:', error);
      alert('An error occurred while declining user access. Please try again.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select rows to delete.');
      return;
    }
    try {
      const userIds = selectedRows.map((row) => row.id);
      await axios.delete('http://localhost:3000/api/deleteUsers', {
        data: { userIds },
      });
      console.log(`Users ${userIds.join(', ')} deleted successfully.`);
      alert('Selected users deleted successfully.');
      fetchUserData();
      // Do not clear selectedRows here
    } catch (error) {
      console.error('Error deleting users:', error);
      alert('An error occurred while deleting users. Please try again.');
    }
  };

  const handleRowClick = (data) => {
    try {
      const index = selectedRows.findIndex((row) => row.id === data.id);
      if (index === -1) {
        setSelectedRows([...selectedRows, data]);
        console.log(`Row ${data.id} selected.`);
      } else {
        setSelectedRows(selectedRows.filter((row) => row.id !== data.id));
        console.log(`Row ${data.id} deselected.`);
      }
    } catch (error) {
      console.error('Error handling row click:', error);
      alert('An error occurred while handling row click. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchUserData();
    setSelectedRows([]);
  };

  return (
    <div className={Styles.Container}>
      <div className={Styles.formContainer}>
        <div className={Styles.formHeader}>
          <h1>
            <i>Profile Privileges</i>
          </h1>
          <button
            type="button"
            onClick={handleRefresh}
            className={` ${Styles.refreshButton}`}
          >
            &#x21bb; {/* Unicode character for refresh */}
          </button>
        </div>
        <div className={Styles.formBody}>
          {userData.length > 0 && (
            <TableUsers userData={userData} onRowClick={handleRowClick} />
          )}
          <div className={Styles.column}>
            <div className={Styles.row}>
              <button
                type="button"
                onClick={handlePromoteSelected}
                className={Styles.button}
              >
                Promote to Admin
              </button>
              <button
                type="button"
                onClick={handleDemoteSelected}
                className={Styles.button}
              >
                Demote to User
              </button>
              <button
                type="button"
                onClick={handleApproveSelected}
                className={Styles.button}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={handleDeclineSelected}
                className={Styles.button}
              >
                Decline Access
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                className={Styles.button}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePrivileges;
