import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const headerClass = `header ${isScrolled ? 'header-scrolled' : ''}`;
  
  return (
    <header className={headerClass}>
      <div className="container">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-text">RentMate</span>
          </Link>
          
          <nav className={`nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/properties" className={location.pathname.includes('/properties') ? 'active' : ''}>
                  Properties
                </Link>
              </li>
              
              {currentUser && (
                <>
                  {isAdmin ? (
                    <>
                      <li className="nav-item">
                        <Link to="/admin/dashboard" className={location.pathname.includes('/admin/dashboard') ? 'active' : ''}>
                          Dashboard
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/admin/bookings" className={location.pathname.includes('/admin/bookings') ? 'active' : ''}>
                          Booking Requests
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link to="/bookings" className={location.pathname.includes('/bookings') ? 'active' : ''}>
                          My Bookings
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/favorites" className={location.pathname.includes('/favorites') ? 'active' : ''}>
                          Favorites
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
            
            <div className="auth-buttons">
              {currentUser ? (
                <div className="user-menu">
                  <button className="user-menu-button">
                    <div className="user-initial">{currentUser.email[0].toUpperCase()}</div>
                    <span className="user-email truncate">{currentUser.email}</span>
                  </button>
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-role">{isAdmin ? 'Admin' : 'Tenant'}</div>
                      <div className="user-email">{currentUser.email}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="btn btn-primary auth-btn">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </nav>
          
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span className={`menu-icon ${isMobileMenuOpen ? 'menu-open' : ''}`}></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;