import React, { useState } from 'react';
import Styles from './TableUsers.module.css'; // Import your CSS module

const placeholderHeaders = {
  id: 'ID',
  email: 'Email',
  role: 'Role',
  Access: 'Access',
};

const TableUsers = ({ userData, onRowClick }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData.id === selectedRow ? null : rowData.id);
    onRowClick(rowData); // Pass the rowData to the parent component
  };

  return (
    <table className={Styles.customTable}>
      <thead>
        <tr>
          {Object.keys(placeholderHeaders).map((header) => (
            <th key={header} className={Styles.customTh}>
              {placeholderHeaders[header]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {userData.map((data, index) => (
          <tr
            key={index}
            className={`${Styles.customTr} ${
              data.id === selectedRow ? Styles.selected : ''
            }`}
            onClick={() => handleRowClick(data)}
          >
            <td className={Styles.customTd}>{data.id}</td>
            <td className={Styles.customTd}>{data.email}</td>
            <td className={Styles.customTd}>{data.role}</td>
            <td className={Styles.customTd}>{data.access}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableUsers;
