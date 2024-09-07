import express from 'express';

import { getNotes, addNote, updateNote, deleteNote } from '../controllers/NotesController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getNotes);
router.post('/', verifyToken, addNote);
router.put('/:id', verifyToken, updateNote); // Update note route
router.delete('/:id', verifyToken, deleteNote);

export default router;
