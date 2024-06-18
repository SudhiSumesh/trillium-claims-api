import express from "express";
import {
  addNoteController,
  deleteNoteController,
  getAllNotsController,
} from "../controllers/notsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

// Routes
// Get all nots related to claim
router.get("/getAllNotes", authenticateUser, getAllNotsController);

// add new nots related to claim
router.post("/addNote", authenticateUser, addNoteController);

//delete notes
router.delete("/deleteNote/:noteId", authenticateUser, deleteNoteController);
export default router;
