import { executeQuery } from "../config/dbConfig.js";
import dotenv from "dotenv";

dotenv.config();
const TABLE = process.env.TABLE;

//list diagnosis based on claims
export const diagnosisController = async (req, res) => {
  try {
    const { visitId } = req.params;
    if (!visitId) {
      return res.status(400).json({ message: "Visit ID is required" });
    }
    // Check if the visitId exists
    const checkQuery = `
      SELECT COUNT(*) AS count 
      FROM ${TABLE} 
      WHERE VISIT_ID = ?
    `;
    const checkResult = await executeQuery(checkQuery, [visitId]);

    if (checkResult[0].count === 0) {
      return res.status(404).send({ message: "Visit Id not found" });
    }

    const query = `SELECT DIAGNOSIS_ID, ICD_ID_ONE, ICD_ID_TWO, ICD_ID_THREE, ICD_ID_FOUR, ICD_ID_FIVE, ICD_ID_SIX, ICD_ID_SEVEN, ICD_ID_EIGHT, ICD_CODE_ONE, ICD_CODE_TWO, ICD_CODE_THREE, ICD_CODE_FOUR, ICD_CODE_FIVE, ICD_CODE_SIX, ICD_CODE_SEVEN, ICD_CODE_EIGHT, ICD_CODE_ONE_DESCRIPTION, ICD_CODE_TWO_DESCRIPTION, ICD_CODE_THREE_DESCRIPTION, ICD_CODE_FOUR_DESCRIPTION, ICD_CODE_FIVE_DESCRIPTION, ICD_CODE_SIX_DESCRIPTION, ICD_CODE_SEVEN_DESCRIPTION, ICD_CODE_EIGHT_DESCRIPTION FROM ${TABLE} WHERE VISIT_ID= ?`;

    const results = await executeQuery(query, [visitId]);

    const visitDiagnosisDtoList = results.map((item) => {
      return {
        visitDiagnosisId: item.DIAGNOSIS_ID,
        dx1: {
          icdId: item.ICD_ID_ONE,
          icdCode: item.ICD_CODE_ONE,
          icdDescription: item.ICD_CODE_ONE_DESCRIPTION,
          rangeId: 0,
        },
        dx2: {
          icdId: item.ICD_ID_TWO,
          icdCode: item.ICD_CODE_TWO,
          icdDescription: item.ICD_CODE_TWO_DESCRIPTION,
          rangeId: 0,
        },
        dx3: {
          icdId: item.ICD_ID_THREE,
          icdCode: item.ICD_CODE_THREE,
          icdDescription: item.ICD_CODE_THREE_DESCRIPTION,
          rangeId: 0,
        },
        dx4: {
          icdId: item.ICD_ID_FOUR,
          icdCode: item.ICD_CODE_FOUR,
          icdDescription: item.ICD_CODE_FOUR_DESCRIPTION,
          rangeId: 0,
        },
        dx5: {
          icdId: item.ICD_ID_FIVE,
          icdCode: item.ICD_CODE_FIVE,
          icdDescription: item.ICD_CODE_FIVE_DESCRIPTION,
          rangeId: 0,
        },
        dx6: {
          icdId: item.ICD_ID_SIX,
          icdCode: item.ICD_CODE_SIX,
          icdDescription: item.ICD_CODE_SIX_DESCRIPTION,
          rangeId: 0,
        },
        dx7: {
          icdId: item.ICD_ID_SEVEN,
          icdCode: item.ICD_CODE_SEVEN,
          icdDescription: item.ICD_CODE_SEVEN_DESCRIPTION,
          rangeId: 0,
        },
        dx8: {
          icdId: item.ICD_ID_EIGHT,
          icdCode: item.ICD_CODE_EIGHT,
          icdDescription: item.ICD_CODE_EIGHT_DESCRIPTION,
          rangeId: 0,
        },
      };
    });
    res
      .status(200)
      .json({ responseCode: 0, responseType: 0, visitDiagnosisDtoList });
  } catch (error) {
    console.error("Database query error");
    res.status(500).send("Internal Server Error");
  }
};

// update charges (not allowing null vallues)
export const updateDiagnosisController = async (req, res) => {
  try {
    const { diagnosisId, ...fieldsToUpdate } = req.body;

    if (!diagnosisId) {
      return res.status(400).json({ message: "Diagnosis ID is required" });
    }

    // Check if the diagnosisId exists and fetch the current values
    const checkQuery = `
      SELECT * 
      FROM ${TABLE} 
      WHERE DIAGNOSIS_ID = ?
    `;
    const checkResult = await executeQuery(checkQuery, [diagnosisId]);

    if (checkResult.length === 0) {
      return res.status(404).send({ message: "Diagnosis ID not found" });
    }

    // Current values from the database
    const currentValues = checkResult[0];

    // Map req.body fields to database columns
    const fieldMapping = {
      icdCodeOne: "ICD_CODE_ONE",
      icdCodeTwo: "ICD_CODE_TWO",
      icdCodeThree: "ICD_CODE_THREE",
      icdCodeFour: "ICD_CODE_FOUR",
      icdCodeFive: "ICD_CODE_FIVE",
      icdCodeSix: "ICD_CODE_SIX",
      icdCodeSeven: "ICD_CODE_SEVEN",
      icdCodeEight: "ICD_CODE_EIGHT",
      icdCodeOneDescription: "ICD_CODE_ONE_DESCRIPTION",
      icdCodeTwoDescription: "ICD_CODE_TWO_DESCRIPTION",
      icdCodeThreeDescription: "ICD_CODE_THREE_DESCRIPTION",
      icdCodeFourDescription: "ICD_CODE_FOUR_DESCRIPTION",
      icdCodeFiveDescription: "ICD_CODE_FIVE_DESCRIPTION",
      icdCodeSixDescription: "ICD_CODE_SIX_DESCRIPTION",
      icdCodeSevenDescription: "ICD_CODE_SEVEN_DESCRIPTION",
      icdCodeEightDescription: "ICD_CODE_EIGHT_DESCRIPTION",
    };

    const columnsToUpdate = [];
    const queryParams = [];

    // Populate columnsToUpdate and queryParams with either new values or existing values
    Object.keys(fieldMapping).forEach((key) => {
      const column = fieldMapping[key];
      const newValue = fieldsToUpdate[key];
      const currentValue = currentValues[column];

      if (newValue !== undefined) {
        columnsToUpdate.push(`${column} = ?`);
        queryParams.push(newValue ?? currentValue ?? "");
      }
    });

    if (columnsToUpdate.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    queryParams.push(diagnosisId);

    const query = `
      UPDATE ${TABLE}
      SET ${columnsToUpdate.join(", ")}
      WHERE DIAGNOSIS_ID = ?
    `;

    await executeQuery(query, queryParams);

    res.status(200).json({ message: "Diagnosis updated successfully" });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Internal Server Error");
  }
};
