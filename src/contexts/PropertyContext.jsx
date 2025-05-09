import { createContext, useContext, useState, useEffect } from 'react';

// Create Property Context
const PropertyContext = createContext();

// Custom hook for using the property context
export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

// Property Provider component
export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load properties from localStorage on initial render
  useEffect(() => {
    const loadProperties = () => {
      const storedProperties = localStorage.getItem('properties');
      
      if (storedProperties) {
        setProperties(JSON.parse(storedProperties));
      } else {
        // Set initial demo properties if none exist
        const initialProperties = [
          {
            id: '1',
            title: 'Modern Downtown Apartment',
            description: 'A beautiful modern apartment in the heart of downtown. Features high ceilings, large windows, and contemporary design elements throughout. Walking distance to restaurants, shopping, and public transportation.',
            rent: 2200,
            location: 'Downtown, New York, NY',
            bedrooms: 2,
            bathrooms: 2,
            area: 1050,
            status: 'available',
            amenities: ['Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Gym', 'Elevator'],
            contact: 'Jane Smith, (212) 555-1234, jane@example.com',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            images: [
              'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
              'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
              'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
              'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg'
            ],
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Spacious Family Home with Garden',
            description: 'Perfect for families, this spacious 3-bedroom home features a large backyard, updated kitchen, and comfortable living spaces. Located in a quiet residential neighborhood with excellent schools nearby.',
            rent: 3100,
            location: 'Brookside, Boston, MA',
            bedrooms: 3,
            bathrooms: 2.5,
            area: 1850,
            status: 'available',
            amenities: ['Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Parking', 'Garden', 'Storage Space'],
            contact: 'Michael Johnson, (617) 555-6789, michael@example.com',
            videoUrl: '',
            images: [
              'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
              'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
              'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg'
            ],
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Luxury Waterfront Condo',
            description: 'Stunning luxury condo with panoramic water views. This unit features high-end finishes, an open concept layout, and a private balcony overlooking the harbor. Building amenities include a pool, fitness center, and 24-hour concierge.',
            rent: 3800,
            location: 'Harbor District, San Francisco, CA',
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            status: 'available',
            amenities: ['Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Parking', 'Gym', 'Pool', 'Security System', 'Balcony'],
            contact: 'Sarah Williams, (415) 555-9012, sarah@example.com',
            videoUrl: '',
            images: [
              'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg',
              'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg',
              'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg',
              'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'
            ],
            createdAt: new Date().toISOString()
          }
        ];
        
        setProperties(initialProperties);
        localStorage.setItem('properties', JSON.stringify(initialProperties));
      }
      
      setLoading(false);
    };
    
    loadProperties();
  }, []);
  
  // Save properties to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('properties', JSON.stringify(properties));
    }
  }, [properties, loading]);
  
  // Get all properties
  const getAllProperties = () => {
    return properties;
  };
  
  // Get available properties
  const getAvailableProperties = () => {
    return properties.filter(property => property.status === 'available');
  };
  
  // Get a single property by ID
  const getPropertyById = (id) => {
    return properties.find(property => property.id === id) || null;
  };
  
  // Add a new property
  const addProperty = (propertyData) => {
    const newProperty = {
      id: crypto.randomUUID(),
      ...propertyData,
      createdAt: new Date().toISOString()
    };
    
    setProperties(prevProperties => [...prevProperties, newProperty]);
    return newProperty;
  };
  
  // Update an existing property
  const updateProperty = (id, propertyData) => {
    setProperties(prevProperties => 
      prevProperties.map(property => 
        property.id === id ? 
          { ...property, ...propertyData, updatedAt: new Date().toISOString() } : 
          property
      )
    );
  };
  
  // Delete a property
  const deleteProperty = (id) => {
    setProperties(prevProperties => 
      prevProperties.filter(property => property.id !== id)
    );
  };
  
  // Context value
  const value = {
    properties,
    loading,
    getAllProperties,
    getAvailableProperties,
    getPropertyById,
    addProperty,
    updateProperty,
    deleteProperty
  };
  
  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyContext;