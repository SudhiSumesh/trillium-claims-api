import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const PATIENT_TABLE = process.env.PATIENT_TABLE;
//get patient name and patient id
export const patientSearchController = async (req, res) => {
  try {
    const { searchInput, clinicId } = req.query;

    // Validate search input
    if (!searchInput || searchInput.length < 3) {
      return res
        .status(400)
        .json({ message: "Search input must be at least 3 characters long" });
    }
    if (!clinicId) {
      return res.status(400).json({ message: "Clinic ID is required" });
    }

    // Ensure clinicId is a number
    const clinicIdNumber = parseInt(clinicId, 10);
    if (isNaN(clinicIdNumber)) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        error: "Clinic ID must be a valid number",
      });
    }
    const query = `
      SELECT PATIENT_ID, FIRST_NAME, LAST_NAME 
      FROM ${PATIENT_TABLE} 
      WHERE CLINIC_ID = ? 
      AND (FIRST_NAME LIKE ? OR LAST_NAME LIKE ?)
    `;

    const results = await executeQuery(query, [
      clinicIdNumber,
      `%${searchInput}%`,
      `%${searchInput}%`,
    ]);
    const formattedResults = results.map((patient) => ({
      patientId: patient.PATIENT_ID,
      patientName: `${patient.FIRST_NAME} ${patient.LAST_NAME}`,
    }));

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      results: formattedResults,
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
