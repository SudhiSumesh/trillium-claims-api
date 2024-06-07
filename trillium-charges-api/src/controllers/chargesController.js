import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const TABLE = process.env.TABLE;

//get charges based on claim
export const chargesController = async (req, res) => {
  try {
    const { claimId } = req.params;
    if (!claimId) {
      return res.status(400).json({ message: "Claim ID is required" });
    }
    // Check if the claimId exists
    const checkQuery = `
      SELECT COUNT(*) AS count 
      FROM  visit_procedure 
      WHERE CLAIM_ID = ?
    `;
    const checkResult = await executeQuery(checkQuery, [claimId]);

    if (checkResult[0].count === 0) {
      return res.status(404).send({ message: "Claim ID not found" });
    }
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
    res
      .status(200)
      .json({ responseCode: 0, responseType: 0, visitServiceDtoList });
  } catch (error) {
    console.error("Database query error");
    res.status(500).send("Internal Server Error");
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
      tos = "",
      ndcNumber = "",
      ndcUnits = "",
      ndcMeasure = 0,
      comments = "",
      sequenceNum = 1,
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

    if (!claimId || !clinicId || !visitId) {
      return res.status(400).json({ message: " Required fields are missing" });
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
        TOS,
        NDC_NUMBER,
        NDC_UNITS,
        NDC_MEASURE,
        COMMENTS,
        SEQUENCE_NUM,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
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
      tos,
      ndcNumber,
      ndcUnits,
      ndcMeasure,
      comments,
      sequenceNum,
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

    res.status(201).send({ message: "Charge added successfully" });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Internal Server Error");
  }
};

//update charges

export const updateChargeController = async (req, res) => {
  try {
    const {
      procedureId,
      cptID, // procedureCodeId
      cptCode, //procedureCode
      unit,
      fee,
      amount,
      pos,
      tos,
      ndcNumber,
      ndcUnits,
      ndcMeasure,
      comments,
      sequenceNum,
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
    } = req.body;

    if (!procedureId) {
      return res.status(400).json({ message: "Procedure ID is required" });
    }
    // Check if the procedureId exists
    const checkQuery = `
      SELECT COUNT(*) AS count 
      FROM ${TABLE} 
      WHERE PROCEDURE_ID = ?
    `;
    const checkResult = await executeQuery(checkQuery, [procedureId]);

    if (checkResult[0].count === 0) {
      return res.status(404).send({ message: "Procedure ID not found" });
    }
    const query = `
      UPDATE ${TABLE}
      SET
        PROCEDURE_CODE_ID = ?,
        PROCEDURE_CODE = ?,
        UNIT = ?,
        FEE = ?,
        AMOUNT = ?,
        POS = ?,
        TOS = ?,
        NDC_NUMBER = ?,
        NDC_UNITS = ?,
        NDC_MEASURE = ?,
        COMMENTS = ?,
        SEQUENCE_NUM = ?,
        DESCRIPT = ?,
        DIAGNOSIS_POINTER1 = ?,
        DIAGNOSIS_POINTER2 = ?,
        DIAGNOSIS_POINTER3 = ?,
        DIAGNOSIS_POINTER4 = ?,
        DIAGNOSIS_POINTER5 = ?,
        DIAGNOSIS_POINTER6 = ?,
        DIAGNOSIS_POINTER7 = ?,
        DIAGNOSIS_POINTER8 = ?,
        MODIFIER1 = ?,
        MODIFIER2 = ?,
        MODIFIER3 = ?,
        MODIFIER4 = ?
      WHERE PROCEDURE_ID = ?
    `;

    const queryParams = [
      cptID || 0, // procedureCodeId
      cptCode || "", // procedureCode
      unit || 0,
      fee || 0,
      amount || 0,
      pos || "",
      tos || "",
      ndcNumber || "",
      ndcUnits || "",
      ndcMeasure || 0,
      comments || "",
      sequenceNum || 0,
      descript || "",
      diagnosisPointer1 || 0,
      diagnosisPointer2 || 0,
      diagnosisPointer3 || 0,
      diagnosisPointer4 || 0,
      diagnosisPointer5 || 0,
      diagnosisPointer6 || 0,
      diagnosisPointer7 || 0,
      diagnosisPointer8 || 0,
      modifier1 || "",
      modifier2 || "",
      modifier3 || "",
      modifier4 || "",
      procedureId,
    ];

    await executeQuery(query, queryParams);

    res.status(200).send({ message: "Charge updated successfully" });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Internal Server Error");
  }
};

//delete charges

export const deleteChargeController = async (req, res) => {
  try {
    const { procedureId } = req.params;

    if (!procedureId) {
      return res.status(400).json({ message: "Procedure ID is required" });
    }

    // Check if the procedureId exists
    const checkQuery = `
      SELECT COUNT(*) AS count 
      FROM ${TABLE} 
      WHERE PROCEDURE_ID = ?
    `;
    const checkResult = await executeQuery(checkQuery, [procedureId]);

    if (checkResult[0].count === 0) {
      return res.status(404).send({ message: "Procedure ID not found" });
    }

    const query = `
      DELETE FROM ${TABLE} 
      WHERE PROCEDURE_ID = ?
    `;

    await executeQuery(query, [procedureId]);

    res.status(200).send({ message: "Charge deleted successfully" });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Internal Server Error");
  }
};
