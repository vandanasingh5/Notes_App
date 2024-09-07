import { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Card, CardContent, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoteForm = ({ setNotes = () => {} }) => { // Default empty function to avoid errors if not provided
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNote = { title, content, due_date: dueDate };
    try {
      const response = await axios.post('http://localhost:5000/api/notes', newNote, { withCredentials: true });
      if (typeof setNotes === 'function') {
        setNotes((prevNotes) => [...prevNotes, response.data.note]);
      }
      setTitle('');
      setContent('');
      setDueDate('');
      toast.success('Note added successfully');
      navigate('/notes'); // Navigate back to notes page after submission
    } catch (error) {
      toast.error('Error creating note');
      console.error('Error creating note:', error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column', // Stack content vertically
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Ensure container covers full viewport height
        padding: 2, // Add padding for better appearance on smaller screens
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 600, // Maximum width for larger screens
          padding: 3, // Padding inside the card
          boxShadow: 3, // Optional: Add shadow for better visual appeal
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add New Note
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Content"
              fullWidth
              margin="normal"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <TextField
              label="Due Date"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Link
              href="/notes"
              underline="none"
              color="primary"
              sx={{ textAlign: 'center', display: 'block' }}
            >
              Back to Notes
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NoteForm;
