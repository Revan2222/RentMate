import AuthForm from '../components/AuthForm';
import '../styles/AuthPage.css';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <div className="auth-left">
          <div className="auth-info">
            <h1>Welcome to RentMate</h1>
            <p>The modern way to find your perfect home.</p>
            <ul className="feature-list">
              <li>Browse exclusive property listings</li>
              <li>Direct communication with landlords</li>
              <li>Secure booking and application process</li>
              <li>Manage all your rental requests in one place</li>
            </ul>
          </div>
        </div>
        
        <div className="auth-right">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;