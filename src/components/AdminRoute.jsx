import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) {
    return null;
  }
  
  // Redirect to login if not authenticated or not an admin
  if (!currentUser || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }
  
  // Render children if user is authenticated and is an admin
  return children;
};

export default AdminRoute;