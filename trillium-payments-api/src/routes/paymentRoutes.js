import express from "express";
import {
  ledgerController,
  paymentSummaryController,
} from "../controllers/paymentController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// get payment summery
router.get("/payment-summary", authenticateUser, paymentSummaryController);

//get ledger
router.get("/get-ledger", authenticateUser, ledgerController);
export default router;
