import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const LEDGER_TABLE = process.env.LEDGER_TABLE;
const PROCEDURE_TABLE = process.env.PROCEDURE_TABLE; ;

//get payment summery
export const paymentSummaryController = async (req, res) => {
  try {
 
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

