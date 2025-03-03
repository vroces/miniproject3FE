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
  const [existingCard, setExistingCard] = useState(null);
  const [followedPlayers, setFollowedPlayers] = useState([]); // Track followed players' details

  const { user } = useAuth(); // Get logged-in user from AuthContext

  useEffect(() => {
    if (!user) {
      return; // If no user is logged in, don't fetch followed players.
    }

     // Fetch the player's existing card using user._id
  fetch(`/api/player-card/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profilePic) {
          setExistingCard(data); // If card exists, populate the state
          setProfilePic(data.profilePic);
          setPosition(data.position);
          setLocation(data.location);
          setTeam(data.team);
          setBio(data.bio);
        }
      })
      .catch((err) => console.log("Error fetching player card:", err));

    // Fetch followed players using the logged-in user's ID (follower_id in the follow collection)
    fetch(`/api/follow/user/${user._id}`)
      .then((res) => res.json())
      .then((follows) => {
        if (follows.length > 0) {
          const followedPlayerIds = follows.map((follow) => follow.player_card_id); // Get player card IDs

          // Fetch player card details for each followed player
          Promise.all(
            followedPlayerIds.map((id) =>
              fetch(`/api/player-card/${id}`).then((res) => res.json())
            )
          )
            .then((playerCards) => {
              // Now fetch user full names based on user_id
              const fetchUserNames = playerCards.map((player) =>
                fetch(`/api/user/${player.user_id}`).then((res) => res.json())
              );

              // Fetch full names for each followed player
              Promise.all(fetchUserNames).then((users) => {
                const updatedPlayerCards = playerCards.map((player, index) => ({
                  ...player,
                  full_name: users[index].full_name, // Assuming the response has full_name
                }));
                setFollowedPlayers(updatedPlayerCards); // Set updated player data with full names
              });
            });
        } else {
          setFollowedPlayers([]); // No follows found
        }
      })
      .catch((err) => console.log("Error fetching follows:", err));
  }, [user]); // Trigger the effect when the user changes (i.e., after login)

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

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!user || !user._id) {
      console.log("Error: User ID is missing.");
      return;
    }
  
    const userData = { 
      user_id: user._id.toString(), // Ensure user_id is sent as a string
      profilePic, 
      position, 
      location, 
      team, 
      bio 
    };
  
    const url = "http://localhost:5001/api/player-card"; 
  
    if (existingCard) {
      fetch(`${url}/update/${existingCard.user_id ? existingCard.user_id.toString() : existingCard._id.toString()}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Player card updated", data);
        })
        .catch((err) => console.log("Error updating profile:", err));
    } else {
      fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Player card created", data);
        })
        .catch((err) => console.log("Error creating profile:", err));
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
            id="profile-pic-input"
          />
          {profilePic && <img src={profilePic} alt="Profile" className="profile-page-pic" />}
          <div className="profile-page-buttons">
            <HomeButton />
            <LogoutButton />
          </div>
        </div>

        <form onSubmit={handleSave}> {/* Added form element for better control */}
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

          <button type="submit"> {/* Button should trigger form submit */}
            {existingCard ? "Edit Profile" : "Create Profile"}
          </button>
        </form>

        {/* Display followed players */}
        <div className="followed-players-list">
          <h3>Players I'm Following:</h3>
          {followedPlayers.length > 0 ? (
            <ul>
              {followedPlayers.map((playerCard) => (
                <li key={playerCard._id}>
                  {/* Displaying only name, position, and team */}
                  <div>
                    <span>{playerCard.full_name} - {playerCard.position} - {playerCard.team}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You're not following any players yet.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreatePlayerCard;
