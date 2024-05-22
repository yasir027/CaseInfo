// Import necessary modules
import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// MySQL database connection setup
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "yasirsql27",
  database: "sys",
});

// Testing MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
  connection.release();
});

// Routes

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the CaseInfo API");
});

// POST route to add case info
app.post("/api/addCaseInfo", (req, res) => {
  const caseInfo = req.body;

  console.log("Received case info for insertion:", caseInfo);

  const sql = `INSERT INTO ci (caseInfoState, caseInfoDOJ, caseInfoCaseType, caseInfoCaseNo, caseInfoCaseYear, caseInfoJudgeName, caseInfoPartyName, caseInfoCitation, caseInfoRemarks) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    caseInfo.caseInfoState,
    caseInfo.caseInfoDOJ,
    caseInfo.caseInfoCaseType,
    caseInfo.caseInfoCaseNo,
    caseInfo.caseInfoCaseYear,
    caseInfo.caseInfoJudgeName,
    caseInfo.caseInfoPartyName,
    caseInfo.caseInfoCitation,
    caseInfo.caseInfoRemarks,
  ];

  console.log("SQL query:", sql);
  console.log("Values:", values);

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting case info:", err);
      return res.status(500).send("Error inserting case info");
    }
    console.log("Case info added successfully, result:", result);
    res.send("Case info added successfully");
  });
});

// DELETE route to delete case info by caseInfoId
app.delete("/api/deleteCaseInfo/:caseInfoId", (req, res) => {
  const { caseInfoId } = req.params;
  const sql = "DELETE FROM ci WHERE caseInfoId = ?";

  pool.query(sql, [caseInfoId], (err, result) => {
    if (err) {
      console.error("Error deleting case info:", err);
      return res.status(500).send("Error deleting case info");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Case info not found");
    }
    res.send("Case info deleted successfully");
  });
});

app.get("/api/caseInfo", (req, res) => {
  const { caseInfoState, caseInfoDOJ, caseInfoCaseType, caseInfoCaseNo, caseInfoCaseYear, caseInfoJudgeName, caseInfoPartyName, caseInfoCitation, caseinforemarks } = req.query;
  let sql = "SELECT * FROM ci WHERE 1=1";
  let values = [];

  if (caseInfoState) {
    sql += " AND caseInfoState LIKE ?";
    values.push(`%${caseInfoState}%`);
  }
  if (caseInfoDOJ) {
    sql += " AND caseInfoDOJ LIKE ?";
    values.push(`%${caseInfoDOJ}%`);
  }
  if (caseInfoCaseType) {
    sql += " AND caseInfoCaseType LIKE ?";
    values.push(`%${caseInfoCaseType}%`);
  }
  if (caseInfoCaseNo) {
    sql += " AND caseInfoCaseNo LIKE ?";
    values.push(`%${caseInfoCaseNo}%`);
  }
  if (caseInfoCaseYear) {
    sql += " AND caseInfoCaseYear LIKE ?";
    values.push(`%${caseInfoCaseYear}%`);
  }
  if (caseInfoJudgeName) {
    sql += " AND caseInfoJudgeName LIKE ?";
    values.push(`%${caseInfoJudgeName}%`);
  }
  if (caseInfoPartyName) {
    sql += " AND caseInfoPartyName LIKE ?";
    values.push(`%${caseInfoPartyName}%`);
  }
  if (caseInfoCitation) {
    sql += " AND caseInfoCitation LIKE ?";
    values.push(`%${caseInfoCitation}%`);
  }
  if (caseinforemarks) {
    sql += " AND caseinforemarks LIKE ?";
    values.push(`%${caseinforemarks}%`);
  }

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching case info:", err);
      return res.status(500).send("Error fetching case info");
    }
    res.send(results);
  });
});


// PUT route to update case info by caseInfoId
app.put("/api/updateCaseInfo/:caseInfoId", (req, res) => {
  const caseInfoId = req.params.caseInfoId;
  const caseInfoData = req.body; // Contains updated data from client

  console.log("Received case info for update:", caseInfoData);

  // Exclude caseInfoId from caseInfoData to ensure it's not updated
  delete caseInfoData.caseInfoId;

  const sql = `UPDATE ci SET ? WHERE caseInfoId = ?`;

  console.log("SQL query:", sql);
  console.log("Values:", [caseInfoData, caseInfoId]);

  pool.query(sql, [caseInfoData, caseInfoId], (err, result) => {
    if (err) {
      console.error("Error updating case info:", err);
      return res.status(500).send("Error updating case info");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Case info not found");
    }
    console.log("Case info updated successfully, result:", result);
    res.send("Case info updated successfully");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
