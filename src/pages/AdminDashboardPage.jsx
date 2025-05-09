import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import { useBookings } from '../contexts/BookingContext';
import '../styles/AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { getAllProperties, deleteProperty } = useProperties();
  const { getAllBookings } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const properties = getAllProperties();
  const bookings = getAllBookings();
  
  // Filter properties based on search term and status
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort properties with newest first
  const sortedProperties = [...filteredProperties].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  // Stats for the dashboard
  const stats = {
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.status === 'available').length,
    rentedProperties: properties.filter(p => p.status === 'rented').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length
  };
  
  const handleDeleteProperty = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
    }
  };
  
  const handleEditProperty = (id) => {
    navigate(`/admin/properties/edit/${id}`);
  };
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/properties/add" className="btn btn-primary add-property-btn">
          Add New Property
        </Link>
      </div>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{stats.totalProperties}</div>
          <div className="stat-label">Total Properties</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.availableProperties}</div>
          <div className="stat-label">Available</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.rentedProperties}</div>
          <div className="stat-label">Rented</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.pendingBookings}</div>
          <div className="stat-label">Pending Bookings</div>
          {stats.pendingBookings > 0 && (
            <Link to="/admin/bookings" className="view-bookings-link">
              View All
            </Link>
          )}
        </div>
      </div>
      
      <div className="manage-properties">
        <h3>Manage Properties</h3>
        
        <div className="property-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="property-search"
            />
          </div>
          
          <div className="status-filter">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>
        
        {sortedProperties.length === 0 ? (
          <div className="no-properties-message">
            <p>No properties found. Add a new property to get started.</p>
            <Link to="/admin/properties/add" className="btn btn-primary">
              Add New Property
            </Link>
          </div>
        ) : (
          <div className="properties-table-container">
            <table className="properties-table">
              <thead>
                <tr>
                  <th className="image-col">Image</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProperties.map(property => (
                  <tr key={property.id}>
                    <td className="image-cell">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="property-thumbnail"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td className="title-cell">
                      <Link to={`/properties/${property.id}`} className="property-title-link">
                        {property.title}
                      </Link>
                    </td>
                    <td>{property.location}</td>
                    <td className="price-cell">${property.rent}/month</td>
                    <td>
                      <span className={`status-badge ${property.status}`}>
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProperty(property.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;