import React from 'react';

import Navigation from './Navigation';
import Profile from './Profile';
import SearchBar from './SearchBar';
import WelcomeMessage from './WelcomeMessage';

const Header = () => {
  console.log("Header component rendered!");
return (
  <header className="dashboard-header">
    
      <div className="nav-container">
        {/* Group Navigation and Profile Pic in a row */}
        <div className="nav-top">
          <Navigation />
          <Profile />
        </div>

        {/* Search Bar placed below */}
        <SearchBar />
      </div>
    
    <WelcomeMessage />
  </header>
);
};


export default Header;
