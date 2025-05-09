import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) {
    return null;
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  // Render children if user is authenticated
  return children;
};

export default ProtectedRoute;