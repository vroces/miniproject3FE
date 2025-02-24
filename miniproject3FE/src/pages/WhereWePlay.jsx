import React from "react";

import "../styles/WhereWePlay.css"; // Your styles
import Header from "../components/Header";

import Footer from "../components/Footer";


const WhereWePlay = () => {
    return (
        <div className="where-we-play">
          <Header /> {/* Top Header */}
          
          <div className="weplay-content">
            {/* Your content goes here */}
            <h1>Welcome to Where We Play</h1>
            <p>This is where the  content will be displayed.</p>
          </div>
          <Footer /> {/* Footer at the bottom */}
        </div>
      );
    };
export default WhereWePlay;
