import React from "react";
import { useAuth } from "../context/AuthContext"; // Import auth context

const WelcomeMessage = () => {
  const { user } = useAuth(); // Get user info

  // If no user is logged in, do not render anything
  if (!user) return null;

  return (
    <div className="welcome-container">
      <h2>Welcome, {user.full_name || user.username}!</h2> {/* Display full_name or username */}
    </div>
  );
};

export default WelcomeMessage;
