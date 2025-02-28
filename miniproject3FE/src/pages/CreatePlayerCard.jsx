import React, { useState, useEffect } from "react";
import HomeButton from "../components/HomeButton";
import LogoutButton from "../components/LogoutButton";
import Footer from "../components/Footer";
import "../styles/CreatePlayerCardPage.css";

const CreatePlayerCard = () => {
  const [profilePic, setProfilePic] = useState(null); // Track profile pic URL
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [team, setTeam] = useState("");
  const [bio, setBio] = useState("");
  const [existingCard, setExistingCard] = useState(null); // Track if card exists

  // Fetch the existing player card when the component mounts
  useEffect(() => {
    fetch("/api/player-card")  // Fetch the player's existing card
      .then((res) => res.json())
      .then((data) => {
        if (data.profilePic) {
          setExistingCard(data);  // If card exists, populate the state
          setProfilePic(data.profilePic);
          setPosition(data.position);
          setLocation(data.location);
          setTeam(data.team);
          setBio(data.bio);
        }
      })
      .catch((err) => console.log(err)); // Handle error if card not found
  }, []);

  // Handle profile pic change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Set image preview
      };
      reader.readAsDataURL(file); // Read the file and convert to base64
    }
  };

  // Handle form submission (save profile info)
  const handleSave = () => {
    console.log("Saving user profile data...");
    const userData = { profilePic, position, location, team, bio };

    fetch("/api/player-card", {
      method: existingCard ? "POST" : "POST", // You can handle PUT for editing if required
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Player card saved", data);
        // Optionally, handle post-save actions (e.g., redirect, notification)
      })
      .catch((err) => console.log("Error saving profile:", err));
  };

  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <div className="profile-page-top-section">
          <input
            type="file"
            onChange={handleProfilePicChange}
            accept="image/*"
            id="profile-pic-input"
          />
          {profilePic && <img src={profilePic} alt="Profile" className="profile-page-pic" />}
          <div className="profile-page-buttons">
            <HomeButton />
            <LogoutButton />
          </div>
        </div>

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

        <button onClick={handleSave}>
          {existingCard ? "Edit Profile" : "Create Profile"}
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default CreatePlayerCard;
