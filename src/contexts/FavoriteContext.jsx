import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create Favorite Context
const FavoriteContext = createContext();

// Custom hook for using the favorite context
export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};

// Favorite Provider component
export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Load favorites from localStorage on initial render and when user changes
  useEffect(() => {
    const loadFavorites = () => {
      if (!currentUser) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      
      const userFavorites = localStorage.getItem(`favorites_${currentUser.id}`);
      if (userFavorites) {
        setFavorites(JSON.parse(userFavorites));
      } else {
        setFavorites([]);
      }
      
      setLoading(false);
    };
    
    loadFavorites();
  }, [currentUser]);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading && currentUser) {
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    }
  }, [favorites, loading, currentUser]);
  
  // Toggle property as favorite
  const toggleFavorite = (propertyId) => {
    if (!currentUser) return;
    
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(propertyId)) {
        return prevFavorites.filter(id => id !== propertyId);
      } else {
        return [...prevFavorites, propertyId];
      }
    });
  };
  
  // Check if property is in favorites
  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };
  
  // Get all user favorites
  const getFavorites = () => {
    return favorites;
  };
  
  // Context value
  const value = {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    getFavorites
  };
  
  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteContext;