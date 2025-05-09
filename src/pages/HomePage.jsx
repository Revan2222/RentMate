import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { getAvailableProperties } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  
  useEffect(() => {
    // Get available properties and select a few for the featured section
    const availableProperties = getAvailableProperties();
    const featured = availableProperties.slice(0, 3);
    setFeaturedProperties(featured);
  }, [getAvailableProperties]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/properties');
    }
  };
  
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Home</h1>
          <p className="hero-subtitle">
            Browse through our exclusive selection of apartments and houses
          </p>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by location, property type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
        
        <div className="hero-overlay"></div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏙️</div>
              <h3>Premium Locations</h3>
              <p>Find properties in the most desirable neighborhoods and locations</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verified Listings</h3>
              <p>All our properties are verified to ensure quality and accuracy</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Booking</h3>
              <p>Simple and secure booking process with instant updates</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Dedicated Support</h3>
              <p>Our team is always ready to assist you with any questions</p>
            </div>
          </div>
        </div>
      </section>
      
      {featuredProperties.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Properties</h2>
              <Link to="/properties" className="view-all-link">
                View All Properties
              </Link>
            </div>
            
            <div className="featured-grid grid grid-3">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="text-center mb-8">How It Works</h2>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search</h3>
              <p>Browse our selection of available properties based on your preferences</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book</h3>
              <p>Submit a booking request for your desired property with your details</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Approve</h3>
              <p>Once approved, you'll receive all the information to move forward</p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <h3>Move In</h3>
              <p>Meet with the property owner and move into your new home</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Home?</h2>
            <p>Browse our available properties and find the perfect match for your needs</p>
            <Link to="/properties" className="btn btn-primary cta-button">
              View All Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;