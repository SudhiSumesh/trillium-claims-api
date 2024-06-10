import express from "express";
import { addNoteController, deleteNoteController, getAllNotsController } from "../controllers/notsController.js";
const router = express.Router();


// Routes
// Get all nots related to claim
router.get("/getAllNotes", getAllNotsController);

// add new nots related to claim
router.post("/addNote", addNoteController);

//delete notes
router.delete('/deleteNote/:noteId',deleteNoteController)
export default router;

