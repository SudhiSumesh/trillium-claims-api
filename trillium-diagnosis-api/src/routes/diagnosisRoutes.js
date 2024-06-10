import express from "express";
import { diagnosisController, updateDiagnosisController } from "../controllers/diagnosisController.js";
import { icdSearchController } from "../controllers/icdControlller.js";
const router = express.Router();

// Routes
//Get Diagnosis list related to the claim
router.get("/getDiagnosis/:visitId",diagnosisController);

//UPDATE 
router.put('/editDiagnosis',updateDiagnosisController)
//search icd
router.get("/icd-search", icdSearchController);

export default router;
