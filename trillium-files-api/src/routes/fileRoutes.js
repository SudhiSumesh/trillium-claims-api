import express from "express";
import multer from 'multer'
import { addFileController, deleteFileController, getFilesController } from "../controllers/fileController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });
// Routes

// Get all files for a claim
router.get("/getFiles", authenticateUser, getFilesController);

// Add a new file
router.post(
  "/addFile",
  authenticateUser,
  upload.single("file"),
  addFileController
);

// Remove a file
router.delete("/deleteFile", authenticateUser, deleteFileController);

export default router