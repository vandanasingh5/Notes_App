import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch token from cookies and username from localStorage
    const token = Cookies.get('token');
    const storedUsername = localStorage.getItem('username');
  
   
    // Set user state only if both token and username are available
    if (token && storedUsername) {
      setUser({ username: storedUsername, token });
    }
  }, []);

  const login = (userData) => {
    // Store username in localStorage
    localStorage.setItem('username', userData.username);

    // Update user state (token is already stored in cookies automatically)
    setUser(userData);
  };

  const logout = () => {
    // Remove token from cookies and username from localStorage
    Cookies.remove('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return { user, login, logout };
};
