import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import axios from "axios";
import "../styles/PlayerCardsPage.css";

const PlayerCards = () => {
  const [players, setPlayers] = useState([]);
  const [following, setFollowing] = useState([]);

  // Fetch player cards from the backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/player-card");
        setPlayers(response.data); // Store fetched player cards
      } catch (error) {
        console.error("Error fetching player cards:", error);
      }
    };

    fetchPlayers();
  }, []);

  // Handle swipe left (not following)
  const handleSwipeLeft = (player) => {
    console.log(`${player.user_id.full_name} swiped left (Not following)`);

    setPlayers((prev) => prev.filter((p) => p._id !== player._id));
  };

  // Handle swipe right (following the player)
  const handleSwipeRight = (player) => {
    console.log(`${player.user_id.full_name} swiped right (Following)`);

    setFollowing((prevFollowing) => {
      if (!prevFollowing.find((p) => p._id === player._id)) {
        return [...prevFollowing, player];
      }
      return prevFollowing;
    });

    setPlayers((prev) => prev.filter((p) => p._id !== player._id));
  };

  return (
    <div className="player-cards-container">
      {players.map((player) => (
        <PlayerCard
          key={player._id}
          player={{
            name: player.user_id?.full_name || "Unknown Player", // Get name from user table
            position: player.position,
            profilePic: player.profilePic,
            bio: player.bio,
            location: player.location,
            team: player.team,
          }}
          onSwipeLeft={() => handleSwipeLeft(player)}
          onSwipeRight={() => handleSwipeRight(player)}
        />
      ))}

      {/* Following list */}
      <div className="following-list">
        <h2>Following:</h2>
        <ul>
          {following.map((player) => (
            <li key={player._id}>{player.user_id.full_name} - {player.position}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerCards;
