import React from "react";
import { Link } from "react-router-dom";
import PlayerCards from "../components/PlayerCards";
import "../styles/PlayerCardsPage.css";
import LogoutButton from "../components/LogoutButton";
import HomeButton from "../components/HomeButton";

const PlayerCardsPage = () => {
  return (
    <div className="player-cards-wrapper">
      {/* Swipe Instructions */}
      <div className="swipe-instructions">
        <span className="swipe-left">❌ Swipe Left to Pass</span>
        <span className="swipe-right">Swipe Right to Follow Player</span>
      </div>

      {/* Place the "Click here" text directly below the swipe instructions */}
      <div className="create-player-card">
        <span>
          Click <Link to="/create-player-card">here</Link> to create your own custom player card!
        </span>
      </div>

      {/* Player cards container */}
      <div className="player-cards-container">
        <HomeButton />
        <LogoutButton />
        <PlayerCards />
      </div>
    </div>
  );
};

export default PlayerCardsPage;

