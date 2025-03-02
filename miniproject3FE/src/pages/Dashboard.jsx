import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import Auth Context
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../components/Header";
import Hero from "../components/Hero";
import SubHeader from "../components/SubHeader";
import "../styles/DashboardPageStyles.css";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Features from "../components/Features";

const Dashboard = () => {
  const { user } = useAuth(); // Get user info from context
  const navigate = useNavigate(); // Initialize navigation function

  useEffect(() => {
    if (!user) {
      // If user is not logged in, redirect to the landing page (or login page)
      navigate("/"); // Change this to the appropriate route
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Loading...</p>; // Show loading if user is not yet available
  }

  return (
    <>
      <Header />
      <SubHeader />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Dashboard;
