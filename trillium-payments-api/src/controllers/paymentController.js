import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const LEDGER_TABLE = process.env.LEDGER_TABLE;
const PROCEDURE_TABLE = process.env.PROCEDURE_TABLE;

//get payment summery

export const paymentSummaryController = async (req, res) => {
  try {
    const { visitId } = req.query;

    if (!visitId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "cliam ID is required",
        accessToken: null,
      });
    }

    // Check if the VISITId exists
    const checkQuery = `
      SELECT COUNT(*) AS count 
      FROM ${PROCEDURE_TABLE} 
      WHERE VISIT_ID = ?
    `;
    const checkResult = await executeQuery(checkQuery, [visitId]);

    if (checkResult[0].count === 0) {
      return res.status(404).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "visistId not found",
        accessToken: null,
      });
    }

    // Fetch  data from the Procedure table using claimId
    const query = `
      SELECT PROCEDURE_ID ,PROCEDURE_CODE,UNIT,FEE,ADJUSTMENT,PRIMARY_PAID,SECONDARY_PAID,TERTIARY_PAID,PATIENT_PAID
      FROM ${PROCEDURE_TABLE} 
      WHERE VISIT_ID = ?
    `;
    const results = await executeQuery(query, [visitId]);
    const formattedResults = results.map((row) => ({
      procedureId:row.PROCEDURE_ID,
      cptCode: row.PROCEDURE_CODE,
      billed: row.UNIT * row.FEE,
      adjusted: row.ADJUSTMENT,
      paid:
        row.PRIMARY_PAID +
        row.SECONDARY_PAID +
        row.TERTIARY_PAID +
        row.PATIENT_PAID,
      balance:
        row.UNIT * row.FEE -
        (row.PRIMARY_PAID +
          row.SECONDARY_PAID +
          row.TERTIARY_PAID +
          row.PATIENT_PAID),
    }));
    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: formattedResults,
      error: null,
      accessToken: null,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      responseCode: 1,
      responseType: 1,
      data: [],
      error: "Internal Server Error",
      accessToken: null,
    });
  }
};

//get ledger
export const ledgerController = async (req, res) => {
  try {
    const { procedureId } = req.query;

    if (!procedureId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Procedure ID is required",
        accessToken: null,
      });
    }
    // Check if the procidureId exists
    const checkQuery = `
      SELECT COUNT(*) AS count 
      FROM ${LEDGER_TABLE} 
      WHERE PROCEDURE_ID = ?
    `;
    const checkResult = await executeQuery(checkQuery, [procedureId]);
    if (checkResult[0].count === 0) {
      return res.status(404).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Procedure ID not found",
        accessToken: null,
      });
    }
    // Fetch  data from the Procedure table using procedureId
    const query = `
      SELECT 
        DATE AS postedDate,
        CURR_PARTY AS party,
        TYPE AS type,
        AMOUNT AS amount,
        ENTRY_DATE AS createdDate
      FROM ${LEDGER_TABLE}
      WHERE PROCEDURE_ID = ?
    `;
    const results = await executeQuery(query, [procedureId]);
    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: results,
      error: null,
      accessToken: null,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      responseCode: 1,
      responseType: 1,
      data: [],
      error: "Internal Server Error",
      accessToken: null,
    });
  }
};
