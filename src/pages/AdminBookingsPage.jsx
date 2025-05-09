import { useState } from 'react';
import { useBookings } from '../contexts/BookingContext';
import { useProperties } from '../contexts/PropertyContext';
import '../styles/AdminBookingsPage.css';

const AdminBookingsPage = () => {
  const { getAllBookings, updateBookingStatus, deleteBooking } = useBookings();
  const { getPropertyById } = useProperties();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const bookings = getAllBookings();
  
  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });
  
  // Sort bookings with most recent first
  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({
        ...selectedBooking,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    }
  };
  
  const handleDeleteBooking = (bookingId) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(bookingId);
      if (isModalOpen && selectedBooking?.id === bookingId) {
        closeModal();
      }
    }
  };
  
  const openBookingDetails = (booking) => {
    const property = getPropertyById(booking.propertyId);
    setSelectedBooking({
      ...booking,
      property
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };
  
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };
  
  return (
    <div className="admin-bookings-page">
      <h2>Booking Requests</h2>
      
      <div className="booking-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="booking-search"
          />
        </div>
        
        <div className="status-filter">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {sortedBookings.length === 0 ? (
        <div className="no-bookings-message">
          <p>No booking requests found.</p>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tenant</th>
                <th>Property</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBookings.map(booking => {
                const property = getPropertyById(booking.propertyId);
                
                return (
                  <tr key={booking.id} className={getStatusClass(booking.status)}>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td className="tenant-info">
                      <div className="tenant-name">{booking.name}</div>
                      <div className="tenant-phone">{booking.phone}</div>
                    </td>
                    <td>
                      {property ? property.title : 'Unknown Property'}
                    </td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="view-btn"
                        onClick={() => openBookingDetails(booking)}
                      >
                        View
                      </button>
                      
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            className="approve-btn"
                            onClick={() => handleStatusChange(booking.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => handleStatusChange(booking.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {isModalOpen && selectedBooking && (
        <div className="booking-modal-overlay" onClick={closeModal}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>✕</button>
            
            <div className="booking-modal-header">
              <h3>Booking Request Details</h3>
              <span className={`status-badge ${selectedBooking.status}`}>
                {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
              </span>
            </div>
            
            <div className="booking-modal-body">
              <div className="booking-property-details">
                <h4>Property</h4>
                {selectedBooking.property ? (
                  <>
                    <p className="property-title">{selectedBooking.property.title}</p>
                    <p className="property-location">{selectedBooking.property.location}</p>
                    <p className="property-rent">${selectedBooking.property.rent}/month</p>
                  </>
                ) : (
                  <p>Property not found</p>
                )}
              </div>
              
              <div className="booking-tenant-details">
                <h4>Tenant Information</h4>
                <div className="detail-group">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedBooking.name}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedBooking.phone}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Requested on:</span>
                  <span className="detail-value">{formatDate(selectedBooking.createdAt)}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Preferred Move-in Date:</span>
                  <span className="detail-value">
                    {new Date(selectedBooking.moveInDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {selectedBooking.feedback && (
                <div className="booking-feedback">
                  <h4>Additional Information</h4>
                  <p>{selectedBooking.feedback}</p>
                </div>
              )}
              
              {selectedBooking.idProof && (
                <div className="booking-id-proof">
                  <h4>ID Proof</h4>
                  <div className="id-proof-preview">
                    <img src={selectedBooking.idProof} alt="ID Proof" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="booking-modal-actions">
              {selectedBooking.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusChange(selectedBooking.id, 'approved')}
                  >
                    Approve Booking
                  </button>
                  <button 
                    className="btn btn-error"
                    onClick={() => handleStatusChange(selectedBooking.id, 'rejected')}
                  >
                    Reject Booking
                  </button>
                </>
              )}
              <button 
                className="btn btn-secondary"
                onClick={() => handleDeleteBooking(selectedBooking.id)}
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;