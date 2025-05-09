import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import '../styles/PropertyForm.css';

const PropertyForm = ({ editProperty = null }) => {
  const navigate = useNavigate();
  const { addProperty, updateProperty } = useProperties();
  const isEditing = !!editProperty;
  
  const [formData, setFormData] = useState({
    title: editProperty?.title || '',
    description: editProperty?.description || '',
    rent: editProperty?.rent || '',
    location: editProperty?.location || '',
    bedrooms: editProperty?.bedrooms || '',
    bathrooms: editProperty?.bathrooms || '',
    area: editProperty?.area || '',
    status: editProperty?.status || 'available',
    amenities: editProperty?.amenities || [],
    contact: editProperty?.contact || '',
    videoUrl: editProperty?.videoUrl || '',
    images: editProperty?.images || []
  });
  
  const [errors, setErrors] = useState({});
  const [imageUrls, setImageUrls] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const amenitiesList = [
    'Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Parking',
    'Gym', 'Pool', 'Elevator', 'Security System', 'Balcony',
    'Furnished', 'Pets Allowed', 'Wheelchair Access', 'Storage Space', 'Garden'
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          amenities: [...prev.amenities, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          amenities: prev.amenities.filter(amenity => amenity !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleImageUrlsChange = (e) => {
    setImageUrls(e.target.value);
    
    // Clear error for images if it exists
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['title', 'description', 'rent', 'location', 'bedrooms', 'bathrooms', 'area', 'contact'];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Validate rent is a positive number
    if (formData.rent && (isNaN(formData.rent) || Number(formData.rent) <= 0)) {
      newErrors.rent = 'Rent must be a positive number';
    }
    
    // Validate bedrooms and bathrooms are numbers
    ['bedrooms', 'bathrooms', 'area'].forEach(field => {
      if (formData[field] && (isNaN(formData[field]) || Number(formData[field]) <= 0)) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number`;
      }
    });
    
    // Check if at least one image is provided or already exists
    if (formData.images.length === 0 && !imageUrls.trim()) {
      newErrors.images = 'At least one image is required';
    }
    
    // Validate video URL format if provided
    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const processImages = () => {
    // Process image URLs (comma or newline separated)
    if (imageUrls.trim()) {
      const urls = imageUrls.split(/[\n,]+/).map(url => url.trim()).filter(url => url);
      return [...formData.images, ...urls];
    }
    return formData.images;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const propertyData = {
        ...formData,
        images: processImages(),
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area)
      };
      
      if (isEditing) {
        updateProperty(editProperty.id, propertyData);
      } else {
        addProperty(propertyData);
      }
      
      setIsSubmitting(false);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving property:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  return (
    <div className="property-form-container">
      <h2>{isEditing ? 'Edit Property' : 'Add New Property'}</h2>
      
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Property Title*</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Modern 2BR Apartment with City View"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status*</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of the property..."
            rows="4"
          ></textarea>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rent">Monthly Rent (USD)*</label>
            <input
              id="rent"
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              placeholder="e.g., 1500"
              min="0"
              step="50"
            />
            {errors.rent && <span className="error-message">{errors.rent}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location*</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Downtown, Chicago, IL"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
        </div>
        
        <div className="form-row three-col">
          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms*</label>
            <input
              id="bedrooms"
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="e.g., 2"
              min="0"
            />
            {errors.bedrooms && <span className="error-message">{errors.bedrooms}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="bathrooms">Bathrooms*</label>
            <input
              id="bathrooms"
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="e.g., 1.5"
              min="0"
              step="0.5"
            />
            {errors.bathrooms && <span className="error-message">{errors.bathrooms}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="area">Area (sq.ft)*</label>
            <input
              id="area"
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g., 850"
              min="0"
            />
            {errors.area && <span className="error-message">{errors.area}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="contact">Contact Information*</label>
          <input
            id="contact"
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="e.g., John Doe, (123) 456-7890, johndoe@example.com"
          />
          {errors.contact && <span className="error-message">{errors.contact}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="videoUrl">Video URL (optional)</label>
          <input
            id="videoUrl"
            type="text"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="e.g., https://youtube.com/watch?v=..."
          />
          {errors.videoUrl && <span className="error-message">{errors.videoUrl}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="amenities">Amenities</label>
          <div className="amenities-container">
            {amenitiesList.map(amenity => (
              <label key={amenity} className="amenity-checkbox">
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleChange}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="images">Property Images*</label>
          
          {formData.images.length > 0 && (
            <div className="current-images">
              <h4>Current Images</h4>
              <div className="image-preview-container">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Property ${index + 1}`} />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <textarea
            id="images"
            name="imageUrls"
            value={imageUrls}
            onChange={handleImageUrlsChange}
            placeholder="Add image URLs (one per line or comma-separated)"
            rows="3"
          ></textarea>
          <small className="form-hint">
            Enter one URL per line or separate multiple URLs with commas
          </small>
          {errors.images && <span className="error-message">{errors.images}</span>}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              'Saving...' : 
              isEditing ? 'Update Property' : 'Add Property'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;