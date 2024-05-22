import React from "react";
import Styles from "./Table.module.css"; // Import your CSS module

const placeholderHeaders = {
  caseInfoId: "S.No",
  caseInfoState: "State",
  caseInfoDOJ: "DOJ",
  caseInfoCaseType: "Type",
  caseInfoCaseNo: "Case No",
  caseInfoCaseYear: "Year",
  caseInfoJudgeName: "Judge",
  caseInfoPartyName: "Party",
  caseInfoCitation: "Citation",
  caseInfoUser:"User",
  caseInfoDOE: "DOE", // Added column for Date of Entry
  caseInfoRemarks: "Status"
  // Add more mappings as needed
};

const Table = ({ caseData, onRowClick }) => (
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
    {caseData.map((data, index) => (
  <tr key={index} className={Styles.customTr} onClick={() => onRowClick(data)}>
    {Object.values(data).map((value, idx) => (
      <td key={idx} className={Styles.customTd}>
        {value}
      </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
