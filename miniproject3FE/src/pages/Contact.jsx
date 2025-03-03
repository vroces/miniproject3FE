import React, { useState } from "react";
import HomeButton from "../components/HomeButton";
import LogoutButton from "../components/LogoutButton";
import Footer from "../components/Footer";
import "../styles/ContactUs.css"; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false); // New state for submission status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", formData);
    setSubmitted(true); // Set submitted to true after form submission
    // Optionally, send the form data to an API here if needed
  };

  return (
    <div className="contact-page-container">
      <div className="contact-page">
        <HomeButton />
        <LogoutButton />
        <div className="contact-form">
          <h1 className="form-heading">Contact Us</h1>
          <p className="form-subtext">
            We'd love to hear from you! Send us a message and we'll get back to you.
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
          {/* Success message */}
          {submitted && <p className="success-message">Message delivered!</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
