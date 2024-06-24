import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const TABLE = process.env.TABLE;

//get charges based on claim
export const chargesController = async (req, res) => {
  try {
    const { claimId } = req.params;
    // console.log(claimId);
    if (!claimId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Claim ID is required",
        accessToken: null,
      });
    }
    // Check if the claimId exists
    // const checkQuery = `
    //   SELECT COUNT(*) AS count 
    //   FROM  ${TABLE} 
    //   WHERE CLAIM_ID = ?
    // `;
    // const checkResult = await executeQuery(checkQuery, [claimId]);

    // if (checkResult[0].count === 0) {
    //   return res.status(404).json({
    //     responseCode: 1,
    //     responseType: 1,
    //     data: [],
    //     error: "Claim ID not found",
    //     accessToken: null,
    //     // message: "",
    //   });
    // }
    const query = `SELECT PROCEDURE_ID ,PROCEDURE_CODE_ID ,PROCEDURE_CODE,UNIT,FEE,AMOUNT,POS,TOS,NDC_NUMBER,NDC_UNITS,NDC_MEASURE,COMMENTS,SEQUENCE_NUM,DESCRIPT ,DIAGNOSIS_POINTER1,DIAGNOSIS_POINTER2,DIAGNOSIS_POINTER3,DIAGNOSIS_POINTER4,DIAGNOSIS_POINTER5,DIAGNOSIS_POINTER6,DIAGNOSIS_POINTER7,DIAGNOSIS_POINTER8,MODIFIER1,MODIFIER2,MODIFIER3,MODIFIER4 FROM ${TABLE} WHERE CLAIM_ID = ?`;

    const results = await executeQuery(query, [claimId]);
    const visitServiceDtoList = results.map((item) => {
      return {
        procedureId: item.PROCEDURE_ID,
        cptCode: item.PROCEDURE_CODE,
        unit: item.UNIT,
        fee: item.FEE,
        amount: item.AMOUNT,
        pos: item.POS,
        tos: item.TOS,
        icdPointer1: item.DIAGNOSIS_POINTER1,
        icdPointer2: item.DIAGNOSIS_POINTER2,
        icdPointer3: item.DIAGNOSIS_POINTER3,
        icdPointer4: item.DIAGNOSIS_POINTER4,
        icdPointer5: item.DIAGNOSIS_POINTER5,
        icdPointer6: item.DIAGNOSIS_POINTER6,
        icdPointer7: item.DIAGNOSIS_POINTER7,
        icdPointer8: item.DIAGNOSIS_POINTER8,
        modifier1: item.MODIFIER1,
        modifier2: item.MODIFIER2,
        modifier3: item.MODIFIER3,
        modifier4: item.MODIFIER4,
        ndcCode: item.NDC_NUMBER,
        ndcUnit: item.NDC_UNITS,
        ndcMeasure: item.NDC_MEASURE,
        comments: item.COMMENTS,
        sequenceNum: item.SEQUENCE_NUM,
        description: item.DESCRIPT,
        cptId: item.PROCEDURE_CODE_ID,
      };
    });
    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      visitServiceDtoList,
      error: null,
      accessToken: null,
    });
  } catch (error) {
    console.error("Database query error",error);
    res.status(500).json({
      responseCode: 1,
      responseType: 1,
      data: [],
      error: "Internal Server Error",
      accessToken: null,
    });
  }
};

//add new charges
export const addChargeController = async (req, res) => {
  try {
    const {
      clinicId,
      claimId,
      visitId,
      patientId,
      procedureCodeId = 0, //cpt id
      procedureCode = "", ///cpt code
      unit = 1,
      fee = 0,
      amount = 0,
      pos = "",
      // tos = "",
      // ndcNumber = "",
      // // ndcUnits =0,
      // ndcMeasure = 0,
      // comments = "",
      // sequenceNum = 1,
      descript = "",
      diagnosisPointer1 = 0,
      diagnosisPointer2 = 0,
      diagnosisPointer3 = 0,
      diagnosisPointer4 = 0,
      diagnosisPointer5 = 0,
      diagnosisPointer6 = 0,
      diagnosisPointer7 = 0,
      diagnosisPointer8 = 0,
      modifier1 = "",
      modifier2 = "",
      modifier3 = "",
      modifier4 = "",
    } = req.body;

    if (!claimId || !clinicId || !visitId || !patientId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Required fields are missing",
        accessToken: null,
      });
    }

    const query = `
      INSERT INTO ${TABLE} (
        CLINIC_ID,
        CLAIM_ID,
        VISIT_ID,
        PATIENT_ID,
        PROCEDURE_CODE_ID,
        PROCEDURE_CODE,
        UNIT,
        FEE,
        AMOUNT,
        POS,
        DESCRIPT,
        DIAGNOSIS_POINTER1,
        DIAGNOSIS_POINTER2,
        DIAGNOSIS_POINTER3,
        DIAGNOSIS_POINTER4,
        DIAGNOSIS_POINTER5,
        DIAGNOSIS_POINTER6,
        DIAGNOSIS_POINTER7,
        DIAGNOSIS_POINTER8,
        MODIFIER1,
        MODIFIER2,
        MODIFIER3,
        MODIFIER4
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

    const queryParams = [
      clinicId,
      claimId,
      visitId,
      patientId,
      procedureCodeId,
      procedureCode,
      unit,
      fee,
      amount,
      pos,
      // tos,
      // ndcNumber,
      // // ndcUnits?? 0,
      // ndcMeasure,
      // comments,
      // sequenceNum,
      descript,
      diagnosisPointer1,
      diagnosisPointer2,
      diagnosisPointer3,
      diagnosisPointer4,
      diagnosisPointer5,
      diagnosisPointer6,
      diagnosisPointer7,
      diagnosisPointer8,
      modifier1,
      modifier2,
      modifier3,
      modifier4,
    ];

    await executeQuery(query, queryParams);

    res.status(201).json({
      responseCode: 0,
      responseType: 0,
      data: "Charge added successfully",
      error: null,
      accessToken: null,
      // message: "Charge added successfully",
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

//update charges
export const updateChargeController = async (req, res) => {
  try {
    const { procedureId } = req.body;

    if (!procedureId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Procedure ID is required",
        accessToken: null,
        message: "Procedure ID is required",
      });
    }

    // Check if the procedureId exists
    // const checkQuery = `SELECT COUNT(*) AS count FROM ${TABLE} WHERE PROCEDURE_ID = ?`;
    // const checkResult = await executeQuery(checkQuery, [procedureId]);

    // if (checkResult[0].count === 0) {
    //   return res.status(404).json({
    //     responseCode: 1,
    //     responseType: 1,
    //     data: [],
    //     error: "Procedure ID not found",
    //     accessToken: null,
    //     message: "Procedure ID not found",
    //   });
    // }

    // Map request body to database columns
    const columnMap = {
      cptID: "PROCEDURE_CODE_ID",
      cptCode: "PROCEDURE_CODE",
      unit: "UNIT",
      fee: "FEE",
      amount: "AMOUNT",
      pos: "POS",
      tos: "TOS",
      ndcNumber: "NDC_NUMBER",
      ndcUnits: "NDC_UNITS",
      ndcMeasure: "NDC_MEASURE",
      comments: "COMMENTS",
      sequenceNum: "SEQUENCE_NUM",
      descript: "DESCRIPT",
      diagnosisPointer1: "DIAGNOSIS_POINTER1",
      diagnosisPointer2: "DIAGNOSIS_POINTER2",
      diagnosisPointer3: "DIAGNOSIS_POINTER3",
      diagnosisPointer4: "DIAGNOSIS_POINTER4",
      diagnosisPointer5: "DIAGNOSIS_POINTER5",
      diagnosisPointer6: "DIAGNOSIS_POINTER6",
      diagnosisPointer7: "DIAGNOSIS_POINTER7",
      diagnosisPointer8: "DIAGNOSIS_POINTER8",
      modifier1: "MODIFIER1",
      modifier2: "MODIFIER2",
      modifier3: "MODIFIER3",
      modifier4: "MODIFIER4",
    };

    // Build the update query dynamically
    const updateColumns = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(req.body)) {
      if (columnMap[key]) {
        updateColumns.push(`${columnMap[key]} = ?`);
        updateValues.push(value);
      }
    }

    if (updateColumns.length === 0) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "No valid fields to update",
        accessToken: null,
        message: "No valid fields to update",
      });
    }

    const query = `
      UPDATE ${TABLE}
      SET ${updateColumns.join(", ")}
      WHERE PROCEDURE_ID = ?
    `;
    updateValues.push(procedureId);

    await executeQuery(query, updateValues);

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "Charge updated successfully" },
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

//delete charges
export const deleteChargeController = async (req, res) => {
  try {
    const { procedureId } = req.params;

    if (!procedureId) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Procedure ID is required",
        accessToken: null,
        message: "Procedure ID is required",
      });
    }

    // Check if the procedureId exists
    // const checkQuery = `
    //   SELECT COUNT(*) AS count 
    //   FROM ${TABLE} 
    //   WHERE PROCEDURE_ID = ?
    // `;
    // const checkResult = await executeQuery(checkQuery, [procedureId]);

    // if (checkResult[0].count === 0) {
    //   return res.status(404).json({
    //     responseCode: 1,
    //     responseType: 1,
    //     data: [],
    //     error: "Procedure ID not found",
    //     accessToken: null,
    //     message: "Procedure ID not found",
    //   });
    // }

    const query = `
      DELETE FROM ${TABLE} 
      WHERE PROCEDURE_ID = ?
    `;

    await executeQuery(query, [procedureId]);

    res.status(200).json({
      responseCode: 1,
      responseType: 1,
      data: [],
      error: "Charge deleted successfully",
      accessToken: null,
      message: "Charge deleted successfully",
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
