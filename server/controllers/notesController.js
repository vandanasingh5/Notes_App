import db from '../db/db.js';

// Get all notes for a user
export const getNotes = async (req, res) => {
  try {
    const [notes] = await db.execute('SELECT * FROM notes WHERE user_id = ?', [req.userId]);
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Add a note
export const addNote = async (req, res) => {
  const { title, content, due_date } = req.body;
  const created_date = new Date().toISOString().split('T')[0]; // Automatically generate today's date


  try {
    const [result] = await db.execute(
      'INSERT INTO notes (title, content, due_date, created_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, due_date, created_date, req.userId]
    );
    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'Note added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add note' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  const noteId = req.params.id;
  const { title, content, due_date } = req.body; // Don't allow updating created_date

  try {
    // Check if the note exists and belongs to the user
    const [note] = await db.execute('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, req.userId]);
    if (note.length === 0) {
      return res.status(404).json({ error: 'Note not found or you do not have permission to update this note.' });
    }

    // Update the note fields, excluding created_date
    const [result] = await db.execute(
      'UPDATE notes SET title = ?, content = ?, due_date = ? WHERE id = ? AND user_id = ?',
      [title, content, due_date, noteId, req.userId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Note updated successfully' });
    } else {
      res.status(500).json({ error: 'Failed to update note' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const noteId = req.params.id;

  try {
    const [result] = await db.execute('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, req.userId]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
