import express from "express";
import {
  diagnosisController,
  updateDiagnosisController,
} from "../controllers/diagnosisController.js";
import { icdSearchController } from "../controllers/icdControlller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

// Routes
//Get Diagnosis list related to the claim
router.get("/getDiagnosis/:visitId", authenticateUser, diagnosisController);

//UPDATE
router.put("/editDiagnosis", authenticateUser, updateDiagnosisController);
//search icd
router.get("/icd-search", authenticateUser, icdSearchController);

export default router;
