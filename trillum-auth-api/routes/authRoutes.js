import express from "express";
import { loginController } from "../controllers/authController.js";
import { checkAuthorization } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/protected-route", checkAuthorization("BILLER"), (req, res) => {
  res.json({ valid: true });
});
export default router;
