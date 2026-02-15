import './Header.css';
import { Link } from "react-router-dom";

interface HeaderProps {
  userRole?: string;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, userName, onLogout }) => {

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </div>
            <span className="logo-text">SockIt</span>
          </div>
        </div>

        <nav className="header-nav">
            {userRole === "admin" && (
              <a href="/activities" className="nav-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Activities
              </a>
            )}
          {userRole === "user" && (
                  <>
                  <Link to="/my-orders" className="nav-link">
                      My Orders
                    </Link>
                    <Link to="/add-order" className="nav-link">
                      Add Order
                    </Link>
                  </>
                  
                )}
            {userName && (
              <button className="nav-link logout-btn" onClick={onLogout}>
                Logout
              </button>
            )}
          
          
        </nav>
      </div>
    </header>
  );
};

export default Header;