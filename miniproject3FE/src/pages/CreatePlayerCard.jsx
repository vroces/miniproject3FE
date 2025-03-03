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
  const base_url = "http://localhost:5001/api/"

  useEffect(() => {
    if (!user) {
      return; // If no user is logged in, don't fetch followed players.
    }
    // Fetch the player's existing card using user._id
    fetch(`${base_url}player-card/${user._id}`)
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
    // Fetch players that the current user is following
    fetch(`${base_url}follow/user/${user._id}`)
      .then((res) => {
        console.log(res)
        if (!res.ok) {
          
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((follows) => {
        console.log("Follows data:", follows);
        if (follows && follows.length > 0) {
          // Extract the player IDs that the user is following
          // Adjust this based on your actual API response structure
          const followedPlayerIds = follows.map((follow) => follow._id);
          console.log(followedPlayerIds)

 
// Fetch player card details for each followed player
Promise.all(
  followedPlayerIds
    .filter((playerCardId) => playerCardId !== undefined) // Filter out undefined IDs
    .map((playerCardId) =>
      fetch(`${base_url}player-card/card/${playerCardId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch player card for ID: ${playerCardId}`);
          }
          return res.json();
        })
    )
)
  .then((playerCards) => {
    console.log("Fetched player cards:", playerCards);
    // Now fetch user full names based on user_id
    const fetchUserNames = playerCards.map((player) =>
      fetch(`${base_url}user/${player.user_id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch user details for ID: ${player.user_id}`);
          }
          return res.json();
        })
    );

    // Fetch full names for each followed player
    Promise.all(fetchUserNames)
      .then((users) => {
        console.log("Fetched user details:", users);
        const updatedPlayerCards = playerCards.map((player, index) => ({
          ...player,
          full_name: users[index]?.full_name || "Unknown Player" // Add fallback
        }));
        setFollowedPlayers(updatedPlayerCards);
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
        // Still show player cards even if names can't be fetched
        setFollowedPlayers(playerCards);
      });
  })
  .catch((err) => {
    console.error("Error fetching player cards:", err);
    setFollowedPlayers([]);
  });
} else {
  setFollowedPlayers([]); // No follows found
}
})
  .catch((err) => {
    console.error("Error fetching follows:", err);
    setFollowedPlayers([]);
  });
}, [user]); // Trigger the effect when the user changes

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
    const url = `${base_url}player-card`; // Removed hardcoded localhost which can cause CORS issues
    if (existingCard) {
      fetch(`${url}/update/${existingCard.user_id ? existingCard.user_id.toString() : existingCard._id.toString()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Player card updated", data);
          alert("Profile updated successfully!");
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
          alert("Failed to update profile. Please try again.");
        });
    } else {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Player card created", data);
          setExistingCard(data); // Update the state with the newly created card
          alert("Profile created successfully!");
        })
        .catch((err) => {
          console.error("Error creating profile:", err);
          alert("Failed to create profile. Please try again.");
        });
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
          <button type="submit">
            {existingCard ? "Edit Profile" : "Create Profile"}
          </button>
        </form>
        {/* Display followed players */}
        {console.log("Followed Players State:", followedPlayers)}
        <div className="followed-players-list">
  <h3>Players I'm Following:</h3>
  {followedPlayers.length > 0 ? (
    <ul>
      {followedPlayers.map((playerCard) => (
        <li key={playerCard._id}>
          <div>
            <span>
              {playerCard.full_name || 'Unknown Player'} - {playerCard.position || 'N/A'} - {playerCard.team || 'N/A'}
            </span>
            <p>{playerCard.bio || 'No bio available'}</p> {/* Display bio */}
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









