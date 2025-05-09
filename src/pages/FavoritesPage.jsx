import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoriteContext';
import { useProperties } from '../contexts/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import '../styles/FavoritesPage.css';

const FavoritesPage = () => {
  const { getFavorites } = useFavorites();
  const { getPropertyById } = useProperties();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadFavorites = () => {
      const favoriteIds = getFavorites();
      
      // Get property objects for each favorite ID
      const properties = favoriteIds
        .map(id => getPropertyById(id))
        .filter(property => property !== null); // Filter out any null results
      
      setFavoriteProperties(properties);
      setLoading(false);
    };
    
    loadFavorites();
  }, [getFavorites, getPropertyById]);
  
  if (loading) {
    return <div className="loading">Loading your favorites...</div>;
  }
  
  return (
    <div className="favorites-page">
      <div className="container">
        <h2>Your Favorite Properties</h2>
        
        {favoriteProperties.length === 0 ? (
          <div className="no-favorites">
            <div className="no-favorites-message">
              <h3>You haven't saved any favorite properties yet.</h3>
              <p>Browse properties and click the heart icon to add them to your favorites.</p>
              <Link to="/properties" className="btn btn-primary">
                Browse Properties
              </Link>
            </div>
          </div>
        ) : (
          <div className="favorites-grid grid grid-3">
            {favoriteProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;