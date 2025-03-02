import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../context/AuthContext"; // Import useAuth to access logout logic
import '../styles/Button.css';

const LogoutButton = () => {
  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // Initialize navigation function

  const handleLogout = () => {
    // Perform logout logic here (clear localStorage and reset state)
    logout(); // Reset user state in context
    localStorage.removeItem("user"); // Remove user from localStorage
    console.log("User logged out");

    // Redirect to the landing page or login page
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
