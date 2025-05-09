import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../contexts/BookingContext';
import { useProperties } from '../contexts/PropertyContext';
import '../styles/BookingsPage.css';

const BookingsPage = () => {
  const { getUserBookings } = useBookings();
  const { getPropertyById } = useProperties();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadBookings = async () => {
      // Get user bookings
      const userBookings = getUserBookings();
      
      // Enrich bookings with property data
      const enrichedBookings = userBookings.map(booking => {
        const property = getPropertyById(booking.propertyId);
        return {
          ...booking,
          property
        };
      });
      
      // Sort bookings with most recent first
      const sortedBookings = enrichedBookings.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setBookings(sortedBookings);
      setLoading(false);
    };
    
    loadBookings();
  }, [getUserBookings, getPropertyById]);
  
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Your booking request is awaiting approval';
      case 'approved':
        return 'Congratulations! Your booking has been approved';
      case 'rejected':
        return 'Unfortunately, your booking request was not approved';
      default:
        return '';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '';
    }
  };
  
  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }
  
  return (
    <div className="bookings-page">
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-message">
            <h3>You haven't made any booking requests yet.</h3>
            <p>Browse available properties and submit a booking request.</p>
            <Link to="/properties" className="btn btn-primary">
              View Available Properties
            </Link>
          </div>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className={`booking-card ${booking.status}`}>
              <div className="booking-header">
                <div className="booking-status">
                  <span className="status-icon">{getStatusIcon(booking.status)}</span>
                  <span className={`status-text ${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="booking-date">
                  Requested on {formatDate(booking.createdAt)}
                </div>
              </div>
              
              <div className="booking-content">
                <div className="property-image">
                  {booking.property?.images && booking.property.images.length > 0 ? (
                    <img 
                      src={booking.property.images[0]} 
                      alt={booking.property?.title || 'Property'} 
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                
                <div className="booking-details">
                  <h3 className="property-title">
                    {booking.property ? (
                      <Link to={`/properties/${booking.property.id}`}>
                        {booking.property.title}
                      </Link>
                    ) : (
                      'Property Not Available'
                    )}
                  </h3>
                  
                  <p className="property-location">
                    {booking.property?.location || 'Location not available'}
                  </p>
                  
                  <div className="booking-info">
                    <div className="info-item">
                      <span className="info-label">Rent:</span>
                      <span className="info-value">
                        ${booking.property?.rent || 'N/A'}/month
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Move-in Date:</span>
                      <span className="info-value">
                        {formatDate(booking.moveInDate)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="status-message">{getStatusText(booking.status)}</p>
                  
                  {booking.status === 'approved' && (
                    <div className="contact-info">
                      <h4>Contact Information</h4>
                      <p>{booking.property?.contact || 'Contact information not available'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;