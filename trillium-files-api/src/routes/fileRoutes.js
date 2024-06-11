import express from "express";
import multer from 'multer'
import { addFileController, deleteFileController, getFilesController } from "../controllers/fileController.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });
// Routes

// Get all files for a claim
router.get('/getFiles', getFilesController);

// Add a new file
router.post('/addFile', upload.single('file'), addFileController );

// Remove a file
router.delete("/deleteFile", deleteFileController);

export default router