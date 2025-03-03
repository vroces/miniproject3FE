import React from 'react';

import Navigation from './Navigation';
import Profile from './Profile';

import WelcomeMessage from './WelcomeMessage';
import LogoutButton from './LogoutButton';

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
<div className="logout-container">
        <LogoutButton />
      </div>
      </div>
    <WelcomeMessage />
  </header>
);
};


export default Header;
