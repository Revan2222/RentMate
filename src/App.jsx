import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { BookingProvider } from './contexts/BookingContext';
import { FavoriteProvider } from './contexts/FavoriteContext';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import BookingsPage from './pages/BookingsPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import PropertyForm from './components/PropertyForm';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PropertyProvider>
          <BookingProvider>
            <FavoriteProvider>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/properties/:id" element={<PropertyDetailPage />} />
                  
                  {/* Protected Tenant Routes */}
                  <Route 
                    path="/bookings" 
                    element={
                      <ProtectedRoute>
                        <BookingsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/favorites" 
                    element={
                      <ProtectedRoute>
                        <FavoritesPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/bookings" 
                    element={
                      <AdminRoute>
                        <AdminBookingsPage />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/properties/add" 
                    element={
                      <AdminRoute>
                        <PropertyForm />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/properties/edit/:id" 
                    element={
                      <AdminRoute>
                        <PropertyEditPage />
                      </AdminRoute>
                    } 
                  />
                  
                  {/* 404 Page */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Layout>
            </FavoriteProvider>
          </BookingProvider>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  );
};

// Edit Property Page Component
const PropertyEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById } = useProperties();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProperty = () => {
      const foundProperty = getPropertyById(id);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        navigate('/admin/dashboard');
      }
      setLoading(false);
    };
    
    loadProperty();
  }, [id, getPropertyById, navigate]);
  
  if (loading) {
    return <div className="loading">Loading property...</div>;
  }
  
  if (!property) {
    return <div className="not-found">Property not found.</div>;
  }
  
  return <PropertyForm editProperty={property} />;
};

export default App;