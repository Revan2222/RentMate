import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoriteContext';
import '../styles/PropertyCard.css';

const PropertyCard = ({ property }) => {
  const { currentUser } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) return;
    toggleFavorite(property.id);
  };
  
  const favoriteClass = currentUser && isFavorite(property.id) 
    ? 'favorite active' 
    : 'favorite';
  
  // Pick the first image as the cover image
  const coverImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';
  
  return (
    <Link 
      to={`/properties/${property.id}`} 
      className={`property-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="property-card-image-container">
        <img
          src={coverImage}
          alt={property.title}
          className="property-card-image"
        />
        
        {currentUser && (
          <button 
            className={favoriteClass}
            onClick={handleFavoriteClick}
            aria-label={isFavorite(property.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        )}
        
        {property.status === 'available' && (
          <div className="property-status available">Available</div>
        )}
        
        {property.status === 'rented' && (
          <div className="property-status rented">Rented</div>
        )}
      </div>
      
      <div className="property-card-content">
        <h3 className="property-card-title">{property.title}</h3>
        
        <div className="property-card-price">${property.rent}/month</div>
        
        <p className="property-card-location">{property.location}</p>
        
        <div className="property-card-details">
          <div className="property-detail">
            <span className="detail-label">Bedrooms</span>
            <span className="detail-value">{property.bedrooms}</span>
          </div>
          
          <div className="property-detail">
            <span className="detail-label">Bathrooms</span>
            <span className="detail-value">{property.bathrooms}</span>
          </div>
          
          <div className="property-detail">
            <span className="detail-label">Area</span>
            <span className="detail-value">{property.area} sq.ft</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;