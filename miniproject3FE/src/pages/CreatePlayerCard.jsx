import React, { useState, useEffect } from "react";
import HomeButton from "../components/HomeButton";
import LogoutButton from "../components/LogoutButton";
import Footer from "../components/Footer";
import "../styles/CreatePlayerCardPage.css";
import { useAuth } from "../context/AuthContext"; // Assuming you're using AuthContext

const CreatePlayerCard = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [team, setTeam] = useState("");
  const [bio, setBio] = useState("");
  const { user } = useAuth(); // Get logged-in user from AuthContext
  const base_url = "http://localhost:5001/api/";

  useEffect(() => {
    if (!user) return;

    console.log("Fetching existing player card for user:", user._id); // Log user ID

    // Fetch the player's existing card using user._id
    fetch(`${base_url}player-card/${user._id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Player card not found");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Existing player card data:", data); // Log the fetched data
        setProfilePic(data.profilePic);
        setPosition(data.position);
        setLocation(data.location);
        setTeam(data.team);
        setBio(data.bio);
      })
      .catch((err) => console.log("Error fetching player card:", err));
  }, [user]);

  // Handle profile pic change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Profile picture updated"); // Log profile picture update
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      console.log("Error: User ID is missing."); // Log if user ID is missing
      return;
    }

    const userData = {
      user_id: user._id,
      profilePic,
      position,
      location,
      team,
      bio,
    };

    const url = `${base_url}player-card`;

    try {
      let response, data;

      console.log("Saving player card data:", userData); // Log player card data to be saved

      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Player card saved successfully:", data); // Log the saved player card data

      alert("Profile created successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <div className="profile-page-top-section">
          <input
            type="file"
            onChange={handleProfilePicChange}
            accept="image/*"
          />
          {profilePic && (
            <img src={profilePic} alt="Profile" className="profile-page-pic" />
          )}
          <div className="profile-page-buttons">
            <HomeButton />
            <LogoutButton />
          </div>
        </div>
        <form onSubmit={handleSave}>
          <div className="profile-form">
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
            <textarea
              placeholder="Short Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <button type="submit">Create Profile</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePlayerCard;
