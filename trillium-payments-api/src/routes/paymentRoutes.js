import express from "express";
import { ledgerController, paymentSummaryController } from "../controllers/paymentController.js";

const router = express.Router();

// get payment summery
router.get("/payment-summary", paymentSummaryController);

//get ledger
router.get("/get-ledger",ledgerController)
export default router;