import express from "express";
import {
  addClaimController,
  claimsListController,
  deleteClaimController,
  updateClaimController,
} from "../controllers/claimsListController.js";
import { patientSearchController } from "../controllers/patientController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

//Routes
// Get claims list
router.get("/getClaimsList", authenticateUser, claimsListController);

// Add a new claim
router.post("/addClaim", authenticateUser, addClaimController);

// Update an existing claim
router.put("/updateClaim", authenticateUser, updateClaimController);

// Delete a claim
router.delete("/deleteClaim/:claimId", authenticateUser, deleteClaimController);

//search patient
router.get("/searchPatient", authenticateUser, patientSearchController);
export default router;
