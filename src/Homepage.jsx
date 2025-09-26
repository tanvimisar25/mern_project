import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const InfoFlipCard = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const navigate = useNavigate();

    const handleSignUpClick = (e) => {
        e.stopPropagation();
        navigate('/SignUp');
    };

    return (
        <div className="info-card-container">
            <div
    className={`info-card ${isFlipped ? 'is-flipped' : ''}`}
    // This line tells the card to flip when you click it
    onClick={() => setIsFlipped(!isFlipped)}
>
                {/* Front of the Card */}
                <div className="info-card-face info-card-front ">
                    <h2>Flip me!</h2>
                </div>

                {/* Back of the Card */}
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
    <div className="homepage-container">
      <div className="layout">
        <div className="main-content">
          <div className="main-header">
            <h1>Let's get you ready for your next interview!!</h1>
            <p className="subtitle">
              Master essential questions with targeted flashcards and multiple-choice questions.
            </p>
          </div>
          
          <InfoFlipCard />

          <div className="decks-section">
            <div className="explore-decks-card">
              {/* ✅ MODIFIED: Title is split into spans to control visibility */}
              <h2><span className="title-expanded">Featured </span>Decks</h2>
              
              {/* --- Expanded View --- */}
              <div className="grid-container">
                {[
                  { title: "General HR Questions", terms: "10 terms", link: "/generalquestions" },
                  { title: "Data Structures & Algorithms", terms: "120 terms" },
                  { title: "Database & SQL", terms: "90 terms" },
                  { title: "General HR Questions", terms: "10 terms", link: "/generalquestions" },
                ].map((card, index) => (
                  card.link ? (
                    <Link
                      key={index}
                      to={card.link}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="grid-item">
                        <h3 className="card-title">{card.title}</h3>
                        <span className="terms-badge">{card.terms}</span>
                      </div>
                    </Link>
                  ) : (
                    <div key={index} className="grid-item">
                      <h3 className="card-title">{card.title}</h3>
                      <span className="terms-badge">{card.terms}</span>
                    </div>
                  )
                ))}
              </div>

              {/* ✅ ADDED: This is the new collapsed view with bubbles */}
              <div className="decks-collapsed-view">
                {[
                    { short: "HR", link: "/generalquestions" },
                    { short: "DSA", link: "/dsa" },
                    { short: "SQL", link: "/sql" },
                    { short: "HR", link: "/generalquestions" }
                ].map((deck, index) => (
                    deck.link ? (
                        <Link key={index} to={deck.link} className="deck-bubble-link">
                            <div className="deck-bubble">{deck.short}</div>
                        </Link>
                    ) : (
                        <div key={index} className="deck-bubble">{deck.short}</div>
                    )
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
