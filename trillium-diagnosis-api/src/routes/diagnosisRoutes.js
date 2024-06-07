import express from "express";
import { diagnosisController, updateDiagnosisController } from "../controllers/diagnosisController.js";
const router = express.Router();

// Routes
//Get Diagnosis list related to the claim
router.get("/getDiagnosis/:visitId",diagnosisController);

//UPDATE 
router.put('/editDiagnosis',updateDiagnosisController)
export default router;
