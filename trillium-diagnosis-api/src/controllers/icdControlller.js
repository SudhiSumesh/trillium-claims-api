import { executeQuery } from "../config/dbConfig.js";

import dotenv from "dotenv";

dotenv.config();
const ICD_TABLE = process.env.ICD_TABLE;
export const icdSearchController = async (req, res) => {
  try {
    const { search, clinicId } = req.query;

    if (!search || search.length < 3) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Search term must be at least 3 characters long",
        accessToken: null,
      });
    }
    if (!clinicId) {
      return res.status(400).json({ message: "Clinic ID is required" });
    }
    const clinicIdNumber = parseInt(clinicId, 10);
    if (isNaN(clinicIdNumber)) {
      return res
        .status(400)
        .json({ message: "Clinic ID must be a valid number" });
    }
    const query = `
      SELECT CODE, ICD_ID
      FROM ${ICD_TABLE}
      WHERE CLINIC_ID = ? AND CODE LIKE ?
    `;

    const queryParams = [clinicIdNumber, `%${search}%`];

    const results = await executeQuery(query, queryParams);
    const formattedResults = results.map((result) => ({
      icdId: result.icd_id,
      icdCode: result.CODE,
    }));

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: formattedResults,
      error: null,
      accessToken: null,
    });
  } catch (error) {
    console.error("Database query error");
    res.status(500).json({
      responseCode: 1,
      responseType: 1,
      data: [],
      error: "Internal Server Error",
      accessToken: null,
    });
  }
};
