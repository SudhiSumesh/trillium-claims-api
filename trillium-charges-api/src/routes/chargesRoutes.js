import express from "express";
import {
  addChargeController,
  chargesController,
  deleteChargeController,
  updateChargeController,
} from "../controllers/chargesController.js";
import { cptSearchController } from "../controllers/cptController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

//Routes
// Get charges related to the claim
router.get("/getCharges/:claimId", authenticateUser, chargesController);

//Add new charges
router.post("/addNewCharges", authenticateUser, addChargeController);

//Update charges
router.put("/editCharges", authenticateUser, updateChargeController);

//delete charges
router.delete(
  "/deleteCharges/:procedureId",
  authenticateUser,
  deleteChargeController
);

//search cpt
router.get("/searchCptCode", authenticateUser, cptSearchController);
export default router;
