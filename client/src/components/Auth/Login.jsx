import { useState } from 'react';
import { Button, TextField, Container, Box, Typography, Card, CardContent, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('Codie Girl'); // Set initial username
  const [password, setPassword] = useState('123456'); // Set initial password
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make login request to the backend
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { username, password },
        { withCredentials: true } // Ensures the token is automatically set in cookies
      );

      // Extract username from the response
      const userData = {
        username: response.data.user.username
      };

      // Update the auth context with username (token is in cookies)
      login(userData);

      // Show success toast notification
      toast.success('Login successful! Redirecting to notes...');

      // Redirect to notes page after a short delay to allow toast message to display
      navigate('/notes'); 
    } catch (error) {
      console.error('Login failed:', error);

      // Show error toast notification based on the error response
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Login failed. Please check your username and password.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 400, padding: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">Login</Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
              Testing credentials:<br />
              <strong>Username:</strong> Codie Girl<br />
              <strong>Password:</strong> 123456
            </Typography>
            <form onSubmit={handleLogin}>
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
                Login
              </Button>
            </form>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href="/signup" underline="none" color="primary">
                Don't have an account? Register here
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
