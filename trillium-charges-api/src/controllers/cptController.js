import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const CPT_TABLE = process.env.CPT_TABLE;

export const cptSearchController = async (req, res) => {
  try {
    const { searchInput } = req.query;

    // Validate search input
    if (!searchInput || searchInput.length < 3) {
      return res
        .status(400)
        .json({ message: "Search input must be at least 3 characters long" });
    }

    // Ensure the searchInput is an integer
    const searchNumber = parseInt(searchInput, 10);
    if (isNaN(searchNumber)) {
      return res
        .status(400)
        .json({ message: "Search input must be a valid number" });
    }

    const query = `
      SELECT CPT_ID,CLINIC_ID,CODE,DESCRIPTION,MODIFIER,DESCRIPTION,FEE,CASH_FEE,POS,TOS,NDC_NUMBER,NDC_UNITS,NDC_MEASURE,COMMENTS
      FROM ${CPT_TABLE} 
      WHERE CODE LIKE ?
    `;

    // Using '%' for wildcard search
    const results = await executeQuery(query, [`%${searchNumber}%`]);

    res.status(200).json({ results });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Internal Server Error");
  }
};
