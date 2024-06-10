import express from "express";
import {
  addClaimController,
  claimsListController,
  deleteClaimController,
  updateClaimController,
} from "../controllers/claimsListController.js";
import { patientSearchController } from "../controllers/patientController.js";

const router = express.Router();

//Routes
// Get claims list
router.get("/getClaimsList", claimsListController);

// Add a new claim
router.post("/addClaim", addClaimController);

// Update an existing claim
router.put("/updateClaim", updateClaimController);

// Delete a claim
router.delete("/deleteClaim/:claimId", deleteClaimController);

//search patient
router.get("/searchPatient", patientSearchController);
export default router;
