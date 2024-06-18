import fs from "fs";
import path from "path";
import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";
dotenv.config();

const TABLE = process.env.TABLE;
//get files
// get files
export const getFilesController = async (req, res) => {
  try {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Patient ID is required",
        accessToken: null,
      });
    }

    const query = `SELECT IMAGE_ID, FILE_NAME, IMAGE_DATE, IMAGE_TYPE, FILE_TYPE FROM ${TABLE} WHERE PATIENT_ID = ?`;
    const results = await executeQuery(query, [patientId]);

    const formattedResults = results.map((row) => ({
      fileId: row.IMAGE_ID,
      fileName: row.FILE_NAME,
      fileType: row.FILE_TYPE,
      fileDate: row.IMAGE_DATE,
      imageType: row.IMAGE_TYPE,
      filePath: `${req.protocol}://${req.get("host")}/uploads/${row.FILE_NAME}`, // Construct the full URL
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

// export const getFilesController = async (req, res) => {
//   try {
//     const { patientId } = req.query;

//     if (!patientId) {
//       return res.status(400).json({
//         responseCode: 1,
//         responseType: 1,
//         data: [],
//         error: "Claim ID is required",
//         accessToken: null,
//         // message: "Claim ID is required",
//       });
//     }

//     const query = `SELECT IMAGE_ID, FILE_NAME,IMAGE_DATE, IMAGE_TYPE, FILE_TYPE FROM ${TABLE} WHERE PATIENT_ID = ?`;
//     const results = await executeQuery(query, [patientId]);

//     const formattedResults = results.map((row) => ({
//       fileId: row.IMAGE_ID,
//       fileName: row.FILE_NAME,
//       // filePath: row.FILE_PATH,
//       fileType: row.FILE_TYPE,
//       fileDate: row.IMAGE_DATE,
//       imageType: row.IMAGE_TYPE,
//     }));

//     res.status(200).json({
//       responseCode: 0,
//       responseType: 0,
//       data: formattedResults,
//       error: null,
//       accessToken: null,
//     });
//   } catch (error) {
//     console.error("Database query error:", error);
//     res.status(500).json({
//       responseCode: 1,
//       responseType: 1,
//       data: [],
//       error: "Internal Server Error",
//       accessToken: null,
//     });
//   }
// };

//add file
export const addFileController = async (req, res) => {
  try {
    const { patientId, fileType, imageTitle, imageNotes, clinicId } = req.body;
    const file = req.file;

    if (!patientId ||!file || !fileType || !clinicId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Patient ID, file, file type, and clinic ID are required",
        accessToken: null,
      });
    }
 const shortFileType = fileType.substring(0, 3);
    const fileName = file.filename;
    const query = `INSERT INTO ${TABLE} (PATIENT_ID, FILE_NAME, FILE_TYPE, IMAGE_TITLE, IMAGE_NOTES, CLINIC_ID, IMAGE_DATE) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    await executeQuery(query, [
      patientId,
      fileName,
      shortFileType,
      imageTitle ?? "",
      imageNotes ?? "",
      clinicId,
    ]);

    res.status(201).json({
      responseCode: 0,
      responseType: 0,
      data: {
        message: "File uploaded successfully",
        filePath: `uploads/${fileName}`,
      }, 
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

//delete file

export const deleteFileController = async (req, res) => {
  try {
    const { imageId } = req.query;

    if (!imageId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Image ID is required",
        accessToken: null,
      });
    }

    const query = `DELETE FROM ${TABLE} WHERE IMAGE_ID = ?`;
    await executeQuery(query, [imageId]);

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "File deleted successfully" },
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
