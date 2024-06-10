import express from "express";
import { addChargeController, chargesController, deleteChargeController, updateChargeController } from "../controllers/chargesController.js";
import { cptSearchController } from "../controllers/cptController.js";

const router = express.Router();


//Routes
// Get charges related to the claim
router.get("/getCharges/:claimId",chargesController );

//Add new charges
router.post('/addNewCharges',addChargeController) 

//Update charges
router.put('/editCharges',updateChargeController)

//delete charges
router.delete("/deleteCharges/:procedureId", deleteChargeController);

//search cpt
router.get("/searchCptCode", cptSearchController);
export default router