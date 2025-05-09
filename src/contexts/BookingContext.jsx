import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create Booking Context
const BookingContext = createContext();

// Custom hook for using the booking context
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

// Booking Provider component
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Load bookings from localStorage on initial render
  useEffect(() => {
    const loadBookings = () => {
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
      setLoading(false);
    };
    
    loadBookings();
  }, []);
  
  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings, loading]);
  
  // Create a new booking
  const createBooking = (bookingData) => {
    const newBooking = {
      id: crypto.randomUUID(),
      ...bookingData,
      createdAt: new Date().toISOString()
    };
    
    setBookings(prevBookings => [...prevBookings, newBooking]);
    return newBooking;
  };
  
  // Get all bookings for admin
  const getAllBookings = () => {
    return bookings;
  };
  
  // Get tenant's bookings
  const getUserBookings = () => {
    if (!currentUser) return [];
    return bookings.filter(booking => booking.userId === currentUser.id);
  };
  
  // Update booking status
  const updateBookingStatus = (bookingId, status) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId ? 
          { ...booking, status, updatedAt: new Date().toISOString() } : 
          booking
      )
    );
  };
  
  // Delete booking
  const deleteBooking = (bookingId) => {
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== bookingId)
    );
  };
  
  // Context value
  const value = {
    bookings,
    loading,
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    deleteBooking
  };
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;