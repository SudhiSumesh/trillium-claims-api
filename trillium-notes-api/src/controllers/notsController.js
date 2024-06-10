import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const TABLE = process.env.TABLE;

//Get all nots
export const getAllNotsController = async (req, res) => {
  try {
    const { claimId } = req.query;

    if (!claimId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Clinic ID is required",
        accessToken: null,
      });
    }

    const query = `
      SELECT NOTE,NOTE_ID
      FROM ${TABLE} 
      WHERE CLAIM_ID = ?
    `;

    const queryParams = [claimId];

    const results = await executeQuery(query, queryParams);
   const formattedResults = results.map((row) => ({
     notesId: row.NOTE_ID,
     notes: row.NOTE,
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


//add nots
export const addNoteController = async (req, res) => {
  try {
    const {
      clinicId,
      visitId,
      claimId,
      userId,
      note,
      appointmentId,
      patientId,
    } = req.body;

    if (
      !clinicId ||
      !visitId ||
      !claimId ||
      !userId ||
      !note ||
      !appointmentId ||
      !patientId
    ) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "All fields are required",
        accessToken: null,
      });
    }

    const query = `
      INSERT INTO ${TABLE} 
      (CLINIC_ID, VISIT_ID, CLAIM_ID, USER_ID, NOTE, CREATED_DATE, HIDDEN, APPOINTMENT_ID, PATIENT_ID)
      VALUES (?, ?, ?, ?, ?, NOW(), 0, ?, ?)
    `;

    const queryParams = [
      clinicId ?? 0,
      visitId ?? 0,
      claimId ?? 0,
      userId ?? 0,
      note ?? "",
      appointmentId ??null,
      patientId??null,
    ];

    await executeQuery(query, queryParams);

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "Note added successfully" },
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

//delete notes
export const deleteNoteController = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!noteId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Note ID is required",
        accessToken: null,
      });
    }

    const query = `
      DELETE FROM ${TABLE} 
      WHERE NOTE_ID = ?
    `;

    const queryParams = [noteId];

    await executeQuery(query, queryParams);

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "Note deleted successfully" },
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