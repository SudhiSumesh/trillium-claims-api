import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const TABLE = process.env.TABLE;

//Get Claims
export const claimsListController = async (req, res) => {
  try {
    const {
      start = 0,
      limit = 10,
      clinicId,
      providerIds = "",
      serviceIds = "",
      status = "",
      startDate,
      endDate,
      facilityIds = "",
      patientName = "",
    } = req.query;

    if (!clinicId) {
      return res.status(400).res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Clinic ID is required",
        accessToken: null,
      });
    }

    // Convert the comma-separated string into an array
    const providerIdsArray = providerIds ? providerIds.split(",") : [];
    const serviceIdsArray = serviceIds ? serviceIds.split(",") : [];
    const statusArray = status ? status.split(",") : [];
    const facilityIdsArray = facilityIds ? facilityIds.split(",") : [];

    // Create placeholders for the query
    const providerPlaceholders = providerIdsArray.map(() => "?").join(",");
    const servicePlaceholders = serviceIdsArray.map(() => "?").join(",");
    const statusPlaceholders = statusArray.map(() => "?").join(",");
    const facilityPlaceholders = facilityIdsArray.map(() => "?").join(",");

    const query = `
      SELECT 
        CLAIM_ID,
        PATIENT_PENDING,
        APPOINTMENT_TYPE,
        STATUS,
        FACILITY_NAME,
        FACILITY_ID,
        PRIMARY_PAYER_ID,
        BILLED,
        DOS,
        MRN,
        PROVIDER_NAME,
        PATIENT_NAME,
        PROVIDER_ID,
        VISIT_ID,
        PATIENT_ID,
        PRIMARY_PAYER_NAME,
        PRIMARY_PENDING,
        PRIMARY_PAID,
        SECONDARY_PAID,
        TERTIARY_PAID,
        PATIENT_PAID,
        APPT_TYPE
      FROM ${TABLE}
      WHERE CLINIC_ID = ?
      ${
        providerIdsArray.length
          ? `AND PROVIDER_ID IN (${providerPlaceholders})`
          : ""
      }
      ${
        serviceIdsArray.length
          ? `AND APPT_TYPE IN (${servicePlaceholders})`
          : ""
      }
      ${statusArray.length ? `AND STATUS IN (${statusPlaceholders})` : ""}
      ${startDate ? "AND DOS >= ?" : ""}
      ${endDate ? "AND DOS <= ?" : ""}
      ${
        facilityIdsArray.length
          ? `AND FACILITY_ID IN (${facilityPlaceholders})`
          : ""
      }
      ${patientName ? "AND PATIENT_NAME LIKE ?" : ""}
      LIMIT ?, ?
    `;

    const queryParams = [
      clinicId,
      ...providerIdsArray,
      ...serviceIdsArray,
      ...statusArray,
      ...(startDate ? [startDate] : []),
      ...(endDate ? [endDate] : []),
      ...facilityIdsArray,
      ...(patientName ? [`%${patientName}%`] : []),
      parseInt(start),
      parseInt(limit),
    ];

    const results = await executeQuery(query, queryParams);

    const reportSummary = {
      dtotalCharges: 0,
      dtotalPatientBalance: 0,
      dtotalInsuranceBalance: 0,
      dtotalPayments: 0,
    };

    const providerSummary = results.map((item) => {
      const dcharges = parseFloat(item.BILLED) || 0;
      const patientBalance = parseFloat(item.PATIENT_PENDING) || 0;
      const insuranceBalance = parseFloat(item.PRIMARY_PENDING) || 0;
      const dpayments =
        (parseFloat(item.PRIMARY_PAID) || 0) +
        (parseFloat(item.SECONDARY_PAID) || 0) +
        (parseFloat(item.TERTIARY_PAID) || 0) +
        (parseFloat(item.PATIENT_PAID) || 0);

      reportSummary.dtotalCharges += dcharges;
      reportSummary.dtotalPatientBalance += patientBalance;
      reportSummary.dtotalInsuranceBalance += insuranceBalance;
      reportSummary.dtotalPayments += dpayments;

      return {
        patientBalance,
        insuranceBalance,
        serviceId: item.APPT_TYPE,
        serviceName: item.APPOINTMENT_TYPE,
        claimStatus: item.STATUS,
        claimId: item.CLAIM_ID,
        facilityName: item.FACILITY_NAME,
        facilityId:item.FACILITY_ID,
        payorId: item.PRIMARY_PAYER_ID,
        payorName: item.PRIMARY_PAYER_NAME,
        iproviderId: item.PROVIDER_ID,
        dcharges,
        dpayments,
        ipatientId: item.PATIENT_ID, //check
        visitId: item.VISIT_ID,
        sdos: item.DOS,
        smrn: item.MRN,
        sproviderName: item.PROVIDER_NAME,
        spatientName: item.PATIENT_NAME,
      };
    });

    res.status(200).json({
      start: parseInt(start),
      totalRecords: results.length,
      limit: parseInt(limit),
      results: null,
      result: {
        reportSummary,
        providerSummary,
      },
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

//add Claim
export const addClaimController = async (req, res) => {
  try {
    const {
      clinicId,
      patientId,
      patientPending, //pat balance
      appointmentType,
      status,
      facilityName,
      primaryPayerId,
      billed,
      dos,
      mrn,
      providerName,
      patientName,
      providerId,
      visitId,
      primaryPayerName,
      primaryPending, // ins balance
      apptType,
    } = req.body;

    if (!clinicId || !patientId || !visitId || !providerId || !primaryPayerId) {
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
        PATIENT_ID,
        PATIENT_PENDING,
        APPOINTMENT_TYPE,
        STATUS,
        FACILITY_NAME,
        PRIMARY_PAYER_ID,
        BILLED,
        DOS,
        MRN,
        PROVIDER_NAME,
        PATIENT_NAME,
        PROVIDER_ID,
        VISIT_ID,
        PRIMARY_PAYER_NAME,
        PRIMARY_PENDING,
        APPT_TYPE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const queryParams = [
      clinicId,
      patientId,
      patientPending ?? 0, //pat balance
      appointmentType ?? null,
      status ?? 0,
      facilityName ?? " ",
      primaryPayerId ?? 0,
      billed ?? 0,
      dos ?? " ",
      mrn ?? " ",
      providerName ?? " ",
      patientName ?? "",
      providerId ?? 0,
      visitId ?? 0,
      primaryPayerName ?? "",
      primaryPending ?? 0, //ins balance
      apptType ?? null,
    ];

    await executeQuery(query, queryParams);

    res.status(201).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "Claim added successfully" },
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

// //update claim
export const updateClaimController = async (req, res) => {
  try {
    const { claimId } = req.body;

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
    //   FROM ${TABLE}
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
    //   });
    // }

    // Prepare the columns and values for the update query
    const updateFields = [];
    const queryParams = [];

    // Mapping of req.body keys to database column names
    const columnMap = {
      clinicId: "CLINIC_ID", 
      patientId: "PATIENT_ID", 
      providerId: "PROVIDER_ID", 
      visitId: "VISIT_ID", 
      primaryPayerId: "PRIMARY_PAYER_ID",
      secondaryPayerId: "SECONDARY_PAYER_ID",
      tertiaryPayerId: "TERTIARY_PAYER_ID",
      primaryInsuranceId: "PRIMARY_INSURANCE_ID",
      secondaryInsuranceId: "SECONDARY_INSURANCE_ID",
      tertiaryInsuranceId: "TERTIARY_INSURANCE_ID",
      generatedUserId: "GENERATED_USER_ID",
      sequenceNum: "SEQUENCE_NUM",
      recordType: "RECORD_TYPE",
      dos: "DOS",
      patientName: "PATIENT_NAME",
      mrn: "MRN",
      providerName: "PROVIDER_NAME",//
      primaryPayerName: "PRIMARY_PAYER_NAME",//
      billingMethod: "BILLING_METHOD",//
      status: "STATUS",//
      filingMode: "FILING_MODE",
      readyToSent: "READY_TO_SENT",
      multipleVisits: "MULTIPLE_VISITS",//
      billed: "BILLED",//
      adjustment: "ADJUSTMENT",//
      primaryPaid: "PRIMARY_PAID",//
      secondaryPaid: "SECONDARY_PAID",//
      tertiaryPaid: "TERTIARY_PAID",//
      patientPaid: "PATIENT_PAID",//
      primaryPending: "PRIMARY_PENDING",//
      secondaryPending: "SECONDARY_PENDING",//
      tertiaryPending: "TERTIARY_PENDING",//
      patientPending: "PATIENT_PENDING",//
      noteCount: "NOTE_COUNT",//
      facilityId: "FACILITY_ID",//
      facilityName: "FACILITY_NAME",//
      claimType: "CLAIM_TYPE",
      secondaryPayerName: "SECONDARY_PAYER_NAME",
      dosTo: "DOS_TO",//
      clinicCptId: "CLINIC_CPT_ID",//
      statusUpdatedDate: "STATUS_UPDATED_DATE",
      apptType: "APPT_TYPE",//
      notes: "NOTES",
      createdUserId: "CREATED_USER_ID",
      createdDate: "CREATED_DATE",
      ownerId: "OWNER_ID",
      ownerName: "OWNER_NAME",
      appointmentType: "APPOINTMENT_TYPE",//
      dueDate: "DUE_DATE",
      locked: "LOCKED",
    };

    for (const [key, value] of Object.entries(req.body)) {
      if (key !== "claimId" && value !== undefined && value !== null) {
        const column = columnMap[key];
        if (column) {
          updateFields.push(`${column} = ?`);
          queryParams.push(value);
        }
      }
    }

    // If no fields to update, respond with an appropriate message
    if (updateFields.length === 0) {
      return res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "No fields to update",
        accessToken: null,
      });
    }

    queryParams.push(claimId); // Add claimId as the last parameter

    const query = `
      UPDATE ${TABLE} 
      SET ${updateFields.join(", ")}
      WHERE CLAIM_ID = ?
    `;

    await executeQuery(query, queryParams);

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "Claim updated successfully" },
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
//delete claim
export const deleteClaimController = async (req, res) => {
  try {
    const { claimId } = req.params;

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
    //   FROM ${TABLE}
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
    //   });
    // }

    // Proceed with deletion if claimId exists
    const deleteQuery = `
      DELETE FROM ${TABLE} 
      WHERE CLAIM_ID = ?
    `;

    await executeQuery(deleteQuery, [claimId]);

    res.status(200).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "Claim deleted successfully" },
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
