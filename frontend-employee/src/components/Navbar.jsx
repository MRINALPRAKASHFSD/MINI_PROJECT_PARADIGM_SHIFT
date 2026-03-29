import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ onMenuClick, onLogout, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast('Searching for: ' + searchQuery, 'info');
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" onClick={() => showToast('No new notifications', 'info')}>
          🔔
          <span className="badge-dot"></span>
        </button>
        
        <button className="icon-btn" onClick={() => showToast('Messages coming soon!', 'info')}>
          💬
        </button>

        <button className="logout-btn btn-secondary" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
