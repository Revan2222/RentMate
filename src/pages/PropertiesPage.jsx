import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import '../styles/PropertiesPage.css';

const PropertiesPage = () => {
  const location = useLocation();
  const { getAllProperties } = useProperties();
  
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  // Common amenities for filter
  const amenitiesList = [
    'Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Parking',
    'Gym', 'Pool', 'Elevator', 'Security System', 'Balcony',
    'Furnished', 'Pets Allowed'
  ];
  
  // Extract search query from URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');
    
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);
  
  // Load properties on component mount
  useEffect(() => {
    const allProperties = getAllProperties();
    // Only show available properties
    const availableProperties = allProperties.filter(p => p.status === 'available');
    setProperties(availableProperties);
    setFilteredProperties(availableProperties);
    setLoading(false);
  }, [getAllProperties]);
  
  // Filter properties based on selected criteria
  useEffect(() => {
    let results = properties;
    
    // Filter by search term (title, description, location)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        property => 
          property.title.toLowerCase().includes(term) ||
          property.description.toLowerCase().includes(term) ||
          property.location.toLowerCase().includes(term)
      );
    }
    
    // Filter by price range
    results = results.filter(
      property => property.rent >= priceRange[0] && property.rent <= priceRange[1]
    );
    
    // Filter by bedrooms
    if (bedrooms !== 'any') {
      if (bedrooms === '4+') {
        results = results.filter(property => property.bedrooms >= 4);
      } else {
        results = results.filter(property => property.bedrooms === parseInt(bedrooms));
      }
    }
    
    // Filter by bathrooms
    if (bathrooms !== 'any') {
      if (bathrooms === '3+') {
        results = results.filter(property => property.bathrooms >= 3);
      } else {
        results = results.filter(property => property.bathrooms === parseFloat(bathrooms));
      }
    }
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      results = results.filter(property => 
        selectedAmenities.every(amenity => 
          property.amenities && property.amenities.includes(amenity)
        )
      );
    }
    
    setFilteredProperties(results);
  }, [properties, searchTerm, priceRange, bedrooms, bathrooms, selectedAmenities]);
  
  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[index] = value;
      return newRange;
    });
  };
  
  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 10000]);
    setBedrooms('any');
    setBathrooms('any');
    setSelectedAmenities([]);
  };
  
  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }
  
  return (
    <div className="properties-page">
      <div className="container">
        <h2>Available Properties</h2>
        
        <div className="properties-layout">
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            </div>
            
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Price Range ($/month)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  min="0"
                  step="100"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  min="0"
                  step="100"
                />
              </div>
              <div className="price-range-slider">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="range-slider"
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <select
                id="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="any">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4+">4+ Bedrooms</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <select
                id="bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              >
                <option value="any">Any</option>
                <option value="1">1 Bathroom</option>
                <option value="1.5">1.5 Bathrooms</option>
                <option value="2">2 Bathrooms</option>
                <option value="2.5">2.5 Bathrooms</option>
                <option value="3+">3+ Bathrooms</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Amenities</label>
              <div className="amenities-list">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="properties-content">
            <div className="results-info">
              <p>{filteredProperties.length} properties found</p>
            </div>
            
            {filteredProperties.length === 0 ? (
              <div className="no-properties-message">
                <h3>No properties found that match your criteria.</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="properties-grid grid grid-2">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;