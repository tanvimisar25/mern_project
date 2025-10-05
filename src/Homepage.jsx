import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const InfoFlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleSignUpClick = (e) => {
    // Stop the click from bubbling up to the parent div, which would flip the card back.
    e.stopPropagation();
    navigate('/SignUp');
  };

  return (
    <div className="info-card-container">
      <div
        className={`info-card ${isFlipped ? 'is-flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* The front face of the card, visible by default. */}
        <div className="info-card-face info-card-front">
          <h2>Flip me!</h2>
        </div>
        {/* The back face of the card, visible after being flipped. */}
        <div className="info-card-face info-card-back">
          <div className="info-card-content">
            <h3>Why PrepDeck?</h3>
            <ul>
              <li>&#10004; Master key concepts with curated flashcards.</li>
              <li>&#10004; Test your knowledge with targeted MCQs.</li>
              <li>&#10004; Build the confidence to ace your next interview.</li>
            </ul>
            <button className="signup-button" onClick={handleSignUpClick}>
              Unlock Your Potential by Signing up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


function Homepage() {
  return (
    <div className="homepage-wrapper">
      <div className="main-header">
        <h1>Let's get you ready for your next interview!!</h1>
        <p className="subtitle">
          Master essential questions with targeted flashcards and multiple-choice questions.
        </p>
      </div>

      {/* Renders the interactive flip card component. */}
      <InfoFlipCard />

      {/* Section to display the featured study decks. */}
      <div className="decks-section">
        <div className="explore-decks-card">
          <h2><span className="title-expanded">Featured </span>Decks</h2>
          
          <div className="grid-container">
            {[
              { title: "General HR Questions", terms: "20 decks", link: "/generalquestions" },
              { title: "Back End Development", terms: "20 decks", link: "/backend" },
              { title: "Machine Learning", terms: "20 decks", link: "/machinelearning" },
              { title: "Ethical Hacking", terms: "20 decks", link: "/ethicalhacking" },
            ].map((card, index) => (
              <Link key={index} to={card.link} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="grid-item">
                  <h3 className="card-title">{card.title}</h3>
                  <span className="terms-badge">{card.terms}</span>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Collapsed bubble view for smaller screens or alternative layouts */}
          <div className="decks-collapsed-view">
            {[
              { short: "HR", link: "/generalquestions" },
              { short: "DEV", link: "/backend" },
              { short: "ML", link: "/machinelearning" },
              { short: "EH", link: "/ethicalhacking" },
            ].map((deck, index) => (
              <Link key={index} to={deck.link} className="deck-bubble-link">
                <div className="deck-bubble">{deck.short}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;