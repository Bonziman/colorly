// src/components/Header.tsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './styles/Header.css';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const profilePictureUrl = user?.profile_picture
    ? `http://127.0.0.1:5000/uploads/profile_pictures/${user.profile_picture.split('/').pop()}`
    : '/src/assets/default_profile.png';

  return (
    <header className="header">
      <div className="header-logo">
        <img src="/src/assets/Colorly Logo.svg" alt="Logo" />
      </div>
      <nav className="header-nav">
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-button">Home</Link>
          </li>
          <li>
            <Link to="/color-generator" className="nav-button">Color Generator</Link>
          </li>
          <li>
            <Link to="/palette-generator" className="nav-button">Palette Generator</Link>
          </li>
        </ul>
      </nav>
      <div className="cta-container">
        {!user ? (
          <div className="auth-buttons">
            <Link to="/login" className="nav-button login">Login</Link>
            <Link to="/register" className="nav-button signup">Sign up</Link>
          </div>
        ) : (
          <div className="user-profile" onClick={toggleDropdown}>
            <div className="user-info">
              <div className="profile-circle">
                <img src={profilePictureUrl} alt="Profile" />
              </div>
              <span className="username">{user.username}</span>
            </div>
            {dropdownVisible && (
              <ul className="dropdown-menu">
                <li>Settings</li>
                <li>Colorly Plus</li>
                <li onClick={handleLogout} className="logout-item">Logout</li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
