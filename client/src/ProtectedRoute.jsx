
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/LoadingSpinner';


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
   
    return <div><Spinner /></div>; 
  }

  if (!user) {
    console.log('User not authenticated, redirecting to login.');
    return <Navigate to="/login" />;
  }

  console.log('User authenticated, rendering children:', user);
  return children;
};

export default ProtectedRoute;
