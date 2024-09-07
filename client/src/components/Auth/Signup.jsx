import { useState } from 'react';
import { Button, TextField, Container, Box, Typography, Card, CardContent, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, password }, { withCredentials: true });
      toast.success('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (error) {
      // Display error message using react-toastify
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Signup failed. Please try again.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 400, padding: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">Signup</Typography>
            <form onSubmit={handleSignup}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Signup
              </Button>
            </form>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href="/login" underline="none" color="primary">
                Already have an account? Login here
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;
