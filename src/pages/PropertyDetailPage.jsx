import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoriteContext';
import ImageCarousel from '../components/ImageCarousel';
import BookingForm from '../components/BookingForm';
import '../styles/PropertyDetailPage.css';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById } = useProperties();
  const { currentUser } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  useEffect(() => {
    const loadProperty = () => {
      const foundProperty = getPropertyById(id);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        // Property not found, redirect to properties page
        navigate('/properties');
      }
      setLoading(false);
    };
    
    loadProperty();
  }, [id, getPropertyById, navigate]);
  
  const handleFavoriteClick = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    toggleFavorite(property.id);
  };
  
  const handleBookingClick = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    setShowBookingForm(true);
    
    // Smooth scroll to booking form
    setTimeout(() => {
      document.getElementById('booking-form-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };
  
  if (loading) {
    return <div className="loading">Loading property details...</div>;
  }
  
  if (!property) {
    return <div className="not-found">Property not found.</div>;
  }
  
  const isPropertyAvailable = property.status === 'available';
  const favoriteClass = currentUser && isFavorite(property.id) 
    ? 'favorite-btn active' 
    : 'favorite-btn';
  
  return (
    <div className="property-detail-page">
      <div className="container">
        <div className="property-header">
          <div className="property-title-section">
            <h2>{property.title}</h2>
            <p className="property-location">{property.location}</p>
          </div>
          
          <div className="property-header-actions">
            <div className="property-price">${property.rent}/month</div>
            
            <div className="action-buttons">
              {currentUser && (
                <button 
                  className={favoriteClass}
                  onClick={handleFavoriteClick}
                  aria-label={isFavorite(property.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {isFavorite(property.id) ? 'Saved' : 'Save'}
                </button>
              )}
              
              {isPropertyAvailable && (
                <button 
                  className="btn btn-primary"
                  onClick={handleBookingClick}
                >
                  Request to Book
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="property-status-banner">
          <span className={`status-badge ${property.status}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
          
          {property.status === 'rented' && (
            <span className="status-message">
              This property is currently rented and not available for booking.
            </span>
          )}
          
          {property.status === 'maintenance' && (
            <span className="status-message">
              This property is currently under maintenance and not available for booking.
            </span>
          )}
        </div>
        
        <div className="property-gallery">
          <ImageCarousel images={property.images} title={property.title} />
        </div>
        
        <div className="property-content">
          <div className="property-main">
            <section className="property-overview">
              <h3>Overview</h3>
              <div className="property-features">
                <div className="feature">
                  <span className="feature-label">Bedrooms</span>
                  <span className="feature-value">{property.bedrooms}</span>
                </div>
                
                <div className="feature">
                  <span className="feature-label">Bathrooms</span>
                  <span className="feature-value">{property.bathrooms}</span>
                </div>
                
                <div className="feature">
                  <span className="feature-label">Area</span>
                  <span className="feature-value">{property.area} sq.ft</span>
                </div>
              </div>
            </section>
            
            <section className="property-description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </section>
            
            {property.amenities && property.amenities.length > 0 && (
              <section className="property-amenities">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {property.videoUrl && (
              <section className="property-video">
                <h3>Video Tour</h3>
                <div className="video-container">
                  <iframe
                    src={property.videoUrl.replace('watch?v=', 'embed/')}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video tour of ${property.title}`}
                  ></iframe>
                </div>
              </section>
            )}
          </div>
          
          <div className="property-sidebar">
            {isPropertyAvailable && !showBookingForm && (
              <div className="booking-cta">
                <h3>Interested in this property?</h3>
                <p>Submit a booking request to express your interest.</p>
                <button 
                  className="btn btn-primary booking-btn"
                  onClick={handleBookingClick}
                >
                  Request to Book
                </button>
                
                <div className="booking-info">
                  <p>
                    <strong>Note:</strong> Submitting a booking request doesn't guarantee the property. 
                    The owner will review your application and get back to you.
                  </p>
                </div>
              </div>
            )}
            
            {!isPropertyAvailable && (
              <div className="property-unavailable">
                <h3>This property is not available</h3>
                <p>
                  {property.status === 'rented' 
                    ? 'This property is currently rented. You can browse other available properties.' 
                    : 'This property is currently under maintenance. Please check back later or browse other properties.'}
                </p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/properties')}
                >
                  View Available Properties
                </button>
              </div>
            )}
          </div>
        </div>
        
        {showBookingForm && isPropertyAvailable && (
          <section id="booking-form-section" className="booking-form-section">
            <BookingForm property={property} />
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailPage;