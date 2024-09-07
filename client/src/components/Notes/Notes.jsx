import { useEffect, useState } from 'react';
import { 
  Container, Card, CardContent, Typography, IconButton, 
  AppBar, Toolbar, Box, Button, Grid, Avatar, Modal, TextField 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes', { withCredentials: true });
        setNotes(response.data);
      } catch (error) {
        toast.error('Error fetching notes');
        console.log(error);
      }
    };
    fetchNotes();
  }, []);

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, { withCredentials: true });
      setNotes(notes.filter(note => note.id !== id));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Error deleting note');
      console.log(error);
    }
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedNote(null);
  };

  const handleUpdateNote = async () => {
    try {
      const updatedNote = {
        title: selectedNote.title,
        content: selectedNote.content,
        due_date: selectedNote.due_date,
      };
      await axios.put(`http://localhost:5000/api/notes/${selectedNote.id}`, updatedNote, { withCredentials: true });
      setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
      setOpenModal(false);
      toast.success('Note updated successfully');
    } catch (error) {
      toast.error('Error updating note');
      console.log(error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: "100vw", display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {/* Full-Width App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ textAlign: 'left', cursor: "pointer" }} onClick={() => toast.info('VYQDA')}>
          VYQDA
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Notes Dashboard
          </Typography>
          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.username}
            </Typography>
            <Avatar alt={user?.username} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        maxWidth="xl" 
        sx={{ flexGrow: 1, mt: 3, display: 'flex', flexDirection: 'column' }}>
        
        <Typography variant="h5" gutterBottom>
          Hi {user?.username}, here are your notes:
        </Typography>

        {/* Add Note Button */}
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          sx={{ mb: 3, alignSelf: 'flex-end' }}
          onClick={() => navigate('/add-note')}
        >
          Add New Note
        </Button>

        {/* Notes Grid */}
        <Grid container spacing={3}>
          {notes?.map(note => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {note.content}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'green', mt: 2 }}>
                    Created: {new Date(note.created_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'red' }}>
                    Due: {new Date(note.due_date).toLocaleDateString()}
                  </Typography>
                </CardContent>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                  <IconButton onClick={() => deleteNote(note.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton onClick={() => handleEditNote(note)}>
                    <EditNoteIcon color="primary" />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Edit Note Modal */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box 
          sx={{ 
            width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' }, 
            bgcolor: 'background.paper', 
            p: 4, 
            mx: 'auto', 
            mt: '15vh', 
            borderRadius: 2 
          }}
        >
          <Typography variant="h6" gutterBottom>Edit Note</Typography>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={selectedNote?.title || ''}
            onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
          />
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            value={selectedNote?.content || ''}
            onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
          />
          <TextField
            label="Due Date"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedNote?.due_date || ''}
            onChange={(e) => setSelectedNote({ ...selectedNote, due_date: e.target.value })}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdateNote}>
              Update Note
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Notes;
