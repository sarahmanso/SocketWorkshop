import React from 'react';
import './Header.css';

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
          <a href="/activities" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Activities 
          </a>
          <a href="/my-orders" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
              <path d="M6 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
              <path d="M18 17a2 2 0 1 0 0 4 2 2.5" />
            </svg>
            My Orders
          </a>
          <a href="/add-order" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
              <circle cx="6.5" cy="16.5" r="2.5" />
              <circle cx="16.5" cy="16.5" r="2.5" />
            </svg>
            Add Order
          </a>
          
        </nav>

        <div className="header-right">
          {userName && (
            <div className="user-menu">
              <button className="user-button">
                <div className="user-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{userName}</span>
                  {userRole && <span className="user-role">{userRole}</span>}
                </div>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              <div className="dropdown-menu">
                <a href="/profile" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  הפרופיל שלי
                </a>
                <a href="/settings" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" />
                  </svg>
                  הגדרות
                </a>
                <div className="dropdown-divider"></div>
                <button onClick={onLogout} className="dropdown-item logout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  התנתק
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;