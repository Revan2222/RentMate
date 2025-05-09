import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import '../styles/BookingForm.css';

const BookingForm = ({ property }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createBooking } = useBookings();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '',
    idProof: '',
    moveInDate: '',
    feedback: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to base64 for localStorage storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, idProof: reader.result }));
        
        // Clear error for this field if it exists
        if (errors.idProof) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.idProof;
            return newErrors;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    
    if (!formData.idProof) {
      newErrors.idProof = 'ID proof is required';
    }
    
    if (!formData.moveInDate) {
      newErrors.moveInDate = 'Move-in date is required';
    } else {
      const selectedDate = new Date(formData.moveInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.moveInDate = 'Date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      createBooking({
        propertyId: property.id,
        userId: currentUser.id,
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        navigate('/bookings');
      }, 3000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setIsSubmitting(false);
    }
  };
  
  if (showSuccess) {
    return (
      <div className="booking-success">
        <div className="success-icon">✓</div>
        <h3>Booking Request Submitted!</h3>
        <p>We've received your request for {property.title}.</p>
        <p>You'll be redirected to your bookings page in a moment...</p>
      </div>
    );
  }
  
  return (
    <div className="booking-form-container">
      <h2>Request to Book</h2>
      <h3>{property.title}</h3>
      <p className="booking-price">${property.rent}/month</p>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="moveInDate">Preferred Move-in Date</label>
          <input
            id="moveInDate"
            type="date"
            name="moveInDate"
            value={formData.moveInDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.moveInDate && <span className="error-message">{errors.moveInDate}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="idProof">ID Proof (Passport/ID Card/Driver's License)</label>
          <input
            id="idProof"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          {errors.idProof && <span className="error-message">{errors.idProof}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="feedback">Additional Information</label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Any special requirements or questions?"
            rows="3"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary booking-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;